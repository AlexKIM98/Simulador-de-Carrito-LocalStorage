//VARIABLES

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = []; //UN ARRAY VACIO PORQUE EN UNA PAG SIEMPRE EL CARRITO COMIENZA VACIO 

cargarEventListener();
function cargarEventListener (){
    //CUANDO AGREGAMOS CURSOS AL CARRITO PRESIONANDO "AGREGAR"
    listaCursos.addEventListener('click', agregarCurso);

    //ELIMINA CURSOS DEL CARRITO
    carrito.addEventListener('click', eliminarCurso);

    //MOSTRAR LOS CURSOS DEL LOCALSTORAGE
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

    //VACIAR CARRITO 
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; 

        limparHTML();
    })
}

//FUNCIONES

//PREVENIR EL EVENT BUBBLING
// PREVENTDEFAULT -->EVITAMOS EL SALTO QUE DA LA PAGINA 
 // YA QUE EN ESTE CASO EL HREF='#' NOS LLEVA A UN DIV Y COMO NO HAY
 //  EN ESTE CASO, NOS TIRA PARA ARRIBA CUANDO CLICKEAMOS.
function agregarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursosSeleccionado = e.target.parentElement.parentElement;

        leerDatosCurso(cursosSeleccionado);
    }

}

function eliminarCurso(e) {
  if(e.target.classList.contains('borrar-curso')){
    const cursoId = e.target.getAttribute('data-id');

    //ELIMINAR DEL ARRAY articulosCarrito POR EL DATA-ID
    articulosCarrito = articulosCarrito.filter(cursosSeleccionado => cursosSeleccionado.id !== cursoId);

    carritoHTML (); //ITERAMOS SOBRE EL CARRITO Y MOSTRAMOS SU HTML
  }
}

 //LEE EL CONTENIDO DEL HTML QUE LE DIMOS CLICK Y EXTRAE LA INFORMACION DEL CURSO
 function leerDatosCurso(cursosSeleccionado){
    // console.log(cursosSeleccionado);

    //CREAR UN OBJETO CON EL CONTENIDO DEL CURSO ACTUAL
    const infoCurso = {
        imagen: cursosSeleccionado.querySelector('img').src,
        titulo: cursosSeleccionado.querySelector('h4').textContent, //EXTRAER TEXTO
        precio: cursosSeleccionado.querySelector('.precio span').textContent,
        id: cursosSeleccionado.querySelector('a').getAttribute('data-id'),
        cantidad: 1
        }
    //REVISA SI UN ELEMENTO YA EXISTE EN EL CARRITO Y SUMA LA CANTIDAD
    //.SOME TE PERMITE ITERAR SOBRE UN ARRAY DE OBJETOS Y VERIFICAR SI UN 
     // ELEMENTO EXISTE
     const existe = articulosCarrito.some(cursosSeleccionado => cursosSeleccionado.id === infoCurso.id);
      if(existe){
        //ACTUALIZAMOS LA CANTIDAD 
        const cursosSeleccionados = articulosCarrito.map(cursosSeleccionado => {
            if(cursosSeleccionado.id === infoCurso.id){
                cursosSeleccionado.cantidad++;
                return cursosSeleccionado; //RETORNA EL OBJETO ACTUALIZAO
            }else{
                return cursosSeleccionado; //SIGUE RETORNANDO OBJETOS QUE NO SON DUPLICADOS
            }
        });
        articulosCarrito = [...cursosSeleccionados];
      }else{
        //AGREGAMOS EL CURSO AL CARRITO
        articulosCarrito = [...articulosCarrito, infoCurso];
      }    

    //AGREGA ELEMENTOS AL ARREGLO DE CARRITO
    //PORQUE COPIAMOS EL CARRITO? PORQUE A MEDIDA QUE VAYAMOS AGREGANDO COSAS AL 
    //CARRITO NO QUEREMOS QUE SE PIERDAN LAS COSAS QUE GUARDAMOS ANTES
    // articulosCarrito = [...articulosCarrito, infoCurso];

    console.log(articulosCarrito);

    carritoHTML();
 }

 //MOSTRAR EL CARRITO DE COMPRAS EN EL HTML 
 //INNERHTML PARA ACCEDER AL HTML
 function carritoHTML () {
    //LIMPIAR HTML
    limparHTML();

    //RECORRE EL CARRITO Y GENERA EL HTML
    articulosCarrito.forEach( cursosSeleccionado => {
        //DESTRUCTURING PARA CREAR VARIABLES 
        const {imagen, titulo, precio, cantidad,id} = cursosSeleccionado; 
        const row = document.createElement('tr');
        row.innerHTML = ` 
        <td>
            <img src="${imagen}" width="120";
        <td/>
        <td>
            ${titulo};
        </td>
        <td>
            ${cursosSeleccionado.precio};
        </td>
        <td>
            ${cursosSeleccionado.cantidad};
        </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>
        `
        // AGREGA EL HTML DEL CARRITO EN EL TBODY
        contenedorCarrito.appendChild(row);
    });

    // AGREGAR LOCALSTORAGE
    sincronizarStorage();
 }

 function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
 }

 //ELIMINA LOS CURSOS DEL TBODY PARA QUE NO DUPLIQUE TODO UNA Y OTRA VEZ

 function limparHTML () {
    //FORMA LENTA
    // contenedorCarrito.innerHTML = '';

    //FORMA RAPIDO - OPTIMIZADOR
    //UN WHILE SE VA A SEGUIR EJECUTANDO MIENTRAS QUE UNA CONDICION SEA VERDADERA 
//FIRSTCHILD -> SI ESTE CONTENEDOR TIENE AL MENOS UN ELEMENTO ESTE CODIGO SE VA A SEGUIR EJECUTANDO
//CLARO PORQUE CADA VEZ QUE AGREGAMOS ALGO ESTO SE EJECUTA Y SI YA HABIA ALGO ANTES LO BORRA, PERO CON EL
  // SPREAD OPERATOR COPIA Y TE DEVUELVE TODO EL CODIGO.
    while(contenedorCarrito.firstChild) {  
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
 }