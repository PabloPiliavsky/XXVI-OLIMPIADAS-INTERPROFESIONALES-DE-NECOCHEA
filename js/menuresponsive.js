document.addEventListener("DOMContentLoaded", iniciarPagina);

function iniciarPagina(){

    function desplegar(){
        document.querySelector(".navegador").classList.toggle("mostrar");
    }

    document.querySelector(".menu").addEventListener("click",desplegar);
}