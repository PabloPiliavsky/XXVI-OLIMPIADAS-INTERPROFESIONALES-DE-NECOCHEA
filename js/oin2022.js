document.addEventListener("DOMContentLoaded",
    iniciarPagina);

function iniciarPagina() {
    const url = 'https://636c42afad62451f9fc6929c.mockapi.io/api/usuarios'
    let pagina = 1;
    let menu = document.querySelector(".menu");
    menu.addEventListener("click", desplegar);
    let index = document.querySelector("#home");
    index.addEventListener("click", function () { cambiarPagina("home") });
    let posiciones = document.querySelector("#posiciones");
    posiciones.addEventListener("click", function () { cambiarPagina("posiciones") });
    let inscripciones = document.querySelector("#inscripciones");
    inscripciones.addEventListener("click", function () { cambiarPagina("inscripciones") });
    window.onload = function () { cambiarPagina("home") };
    let grupos = [];
    let gruposCompleto = [];

    function desplegar() {
        document.querySelector(".navegador").classList.toggle("mostrar");
    }

    function cambiarPagina(nombreDePagina) {
        document.title = nombreDePagina;
        cargarContenido(nombreDePagina);
        window.history.pushState(null, "", nombreDePagina);
    }

    async function cargarContenido(nombreDePagina) {
        let contenido = document.querySelector("#contenido");
        let pagina;
        try {
            let res = await fetch(nombreDePagina + '.html');
            if (res.ok) {
                pagina = await res.text();
                contenido.innerHTML = pagina;
                if (nombreDePagina == "inscripciones") {
                    cargarDatosInscripcion()
                }
            }
            else {
                contenido.innerHTML = 'error en la carga...';
            }
        }
        catch (error) {
            contenido.innerHTML = 'error';
        }

    }

    function cargarDatosInscripcion() {
        let botonEnviar = document.querySelector("#enviarDatos");
        botonEnviar.addEventListener("click", procesarCaptcha);
        botonEnviar.addEventListener("click", agregar);
        let botonCargar = document.querySelector('#recargarCaptcha');
        botonCargar.addEventListener("click", escribirTextoRandom);
        let formInput = document.querySelector("#captchaOrigen");
        formInput.value = textoRamdom(6);
        cargarApi(pagina);
        console.log(grupos)
        let botonSiguiente = document.querySelector("#siguiente");
        botonSiguiente.addEventListener("click", async function () {
            botonSiguiente.setAttribute('disabled', true);
            await adelantarPagina();
            botonSiguiente.removeAttribute('disabled')
        });
        let botonAnterior = document.querySelector("#anterior");
        botonAnterior.addEventListener("click", atrasarPagina);
        let numeroDePagina = document.querySelector("#numeroDePagina");
        numeroDePagina.value = pagina;
        let filtroNombre = document.querySelector("#filtroNombre");
        filtroNombre.addEventListener("change", function () { filtrarColumna(filtroNombre, "nombre") });
        let filtroApellido = document.querySelector("#filtroApellido");
        filtroApellido.addEventListener("change", function () { filtrarColumna(filtroApellido, "apellido") });
        let filtroEdad = document.querySelector("#filtroEdad")
        filtroEdad.addEventListener("change", function () { filtrarColumna(filtroEdad, "edad") });
        let filtroEmail = document.querySelector("#filtroEmail")
        filtroEmail.addEventListener("change", function () { filtrarColumna(filtroEmail, "email") });
        cargarApiCompleta()
        let botonCancelarEdicion = document.querySelector("#cancelarEdicion");
        botonCancelarEdicion.addEventListener("click", cancelarEdicion);
        let botonLugarVacio = document.querySelector("#necesitoCompañeros");
        let cantidadDeVacios = document.querySelector("#cantidadDeCompañeros");
        botonLugarVacio.addEventListener("click", function () { agregarLugaresVacios(cantidadDeVacios.value) });
        let botonagregar3vacios = document.querySelector("#agregar3Vacios");
        botonagregar3vacios.addEventListener("click", function () { agregarLugaresVacios("3") });
    }

    function escribeMensaje(mensaje) {
        let contenedor = document.querySelector("#mensaje");
        contenedor.innerHTML = mensaje;
    }
    /* Generar texto aleatorio*/
    function textoRamdom(largo) {
        let caracteres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        let texto = '';
        for (i = 1; i <= largo; i++) {
            let index = Math.floor(Math.random() * (caracteres.length - 0) + 0);
            let letra = caracteres[index];
            texto = texto + letra;
        }
        return texto
    }

    /* poner texto aleatorio en el captcha*/

    function escribirTextoRandom() {
        let formInput = document.querySelector("#captchaOrigen");
        formInput.value = textoRamdom(6);
    }

    function procesarCaptcha() {
        let formInput = document.querySelector("#captchaOrigen");
        let formCaptcha = document.querySelector("#captcha");
        let valorInput = formInput.value;
        let valorCaptcha = formCaptcha.value;
        if (valorInput == valorCaptcha) {
            escribeMensaje('Captcha Válido!')
        }
        else {
            escribeMensaje('Captcha NO Válido!')
        }
    }

    function reiniciarTabla() {
        cuerpoTabla.innerHTML = "";
    }

    async function cargarApi(pag) {
        try {
            let res = await fetch(`https://636c42afad62451f9fc6929c.mockapi.io/api/usuarios?page= ${pag} &limit=10`);
            let json = await res.json();
            console.log(json);
            grupos = json;
            console.log(grupos);
            actualizarTabla(grupos);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function cargarApiCompleta() {
        try {
            let res = await fetch(url)
            let json = await res.json();
            console.log(json);
            gruposCompleto = json;
            console.log(gruposCompleto);
        }
        catch (error) {
            console.log(error);
        }
    }

    function filtrarColumna(filtroColumna, columna) {
        console.log(filtroColumna.value)
        if (filtroColumna.value == "opcionLetras1") {
            columnaFiltrada = gruposCompleto.filter(elem => elem[columna].length <= 5);
            actualizarTabla(columnaFiltrada);
        }
        if (filtroColumna.value == "opcionLetras2") {
            columnaFiltrada = gruposCompleto.filter(elem => elem[columna].length > 5);
            actualizarTabla(columnaFiltrada);
        }
        if (filtroColumna.value == "opcionEdad1") {
            columnaFiltrada = gruposCompleto.filter(elem => elem[columna] <= 30);
            actualizarTabla(columnaFiltrada);
        }
        if (filtroColumna.value == "opcionEdad2") {
            columnaFiltrada = gruposCompleto.filter(elem => elem[columna] > 30);
            actualizarTabla(columnaFiltrada);
        }
        if (filtroColumna.value == "opcionEmail1") {
            columnaFiltrada = gruposCompleto.filter(elem => elem[columna].length <= 20);
            actualizarTabla(columnaFiltrada);
        }
        if (filtroColumna.value == "opcionEmail2") {
            columnaFiltrada = gruposCompleto.filter(elem => elem[columna].length > 20);
            actualizarTabla(columnaFiltrada);
        }
        if (filtroColumna.value == "") {
            actualizarTabla(grupos);
        }
    }//si quisiera hacerlo con paginado, hacerlo con grupos en vez de gruposCompleto

    async function agregar() {
        reiniciarTabla();
        let nombre = document.querySelector("#nombre").value;
        let apellido = document.querySelector("#apellido").value;
        let edad = document.querySelector("#edad").value;
        let telefono = (document.querySelector("#telefono").value);
        let email = document.querySelector("#email").value;
        let datos = {
            "nombre": nombre,
            "apellido": apellido,
            "edad": edad,
            "telefono": telefono,
            "email": email,
        }

        try {
            let res = await fetch(url, {
                "method": "POST",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(datos)
            })
            let json = await res.json();
            console.log(json);
        }
        catch (error) {
            console.log(error);
        }

        cargarApi(pagina);
        console.log(grupos);
    }

    async function adelantarPagina() {
        try {
            let res = await fetch(`https://636c42afad62451f9fc6929c.mockapi.io/api/usuarios?page= ${pagina + 1} &limit=10`);
            let json = await res.json();
            if (json.length != 0) {
                pagina++;
                cargarApi(pagina);
                numeroDePagina.value = pagina;
                /*filtroNombre.value ="";
                filtroApellido.value ="";
                filtroEdad.value ="";
                filtroEmail.value ="";*///por si quisiera filtrar las paginas
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    function atrasarPagina() {
        console.log(pagina);
        if (pagina > 1) {
            pagina--;
            cargarApi(pagina);
            numeroDePagina.value = pagina;
            /*filtroNombre.value ="";
            filtroApellido.value ="";
            filtroEdad.value ="";
            filtroEmail.value ="";*/
        }
    }

    function actualizarTabla(arreglo) {
        reiniciarTabla();
        let claseEliminar = "eliminar";
        let claseEditar = "editar";
        for (let i = 0; i < arreglo.length; i++) {
            cuerpoTabla.innerHTML +=
                "<tr> <td id=\"nombre" + arreglo[i].id + "\">" + arreglo[i].nombre + "</td>" +//cambio los clase precargar... y escribirlos asi?
                "<td id=\"apellido" + arreglo[i].id + "\">" + arreglo[i].apellido + "</td>" +
                "<td id=\"edad" + arreglo[i].id + "\">" + arreglo[i].edad + "</td>" +
                "<td id=\"telefono" + arreglo[i].id + "\">" + arreglo[i].telefono + "</td>" + //preguntar por estos numeros que no toman en el precargar
                "<td id=\"email" + arreglo[i].id + "\">" + arreglo[i].email + "</td>" +
                "<td><button class=" + claseEditar + " value=" + arreglo[i].id + ">editar</button></td>" +
                "<td><button class=" + claseEliminar + " value=" + arreglo[i].id + ">eliminar</button></td></tr>"
        }
        botonesTabla();
    }

    function botonesTabla() {
        let btnEliminar = [];
        btnEditar = document.querySelectorAll('.editar');
        for (let i = 0; i < btnEditar.length; i++) {
            btnEditar[i].addEventListener("click", function () { editarfila(btnEditar[i].value) });
        }
        btnEliminar = document.querySelectorAll('.eliminar');
        for (let i = 0; i < btnEliminar.length; i++) {
            btnEliminar[i].addEventListener("click", async function () {
                btnEliminar[i].setAttribute('disabled', true)
                await eliminarElemento(btnEliminar[i].value)
                btnEliminar[i].removeAttribute('disabled')
            });
        }
    }

    async function eliminarElemento(id) {
        try {
            await fetch(url + "/" + id, {
                "method": "DELETE",
            })
        } catch (error) {
            console.log(error);
        }
        cargarApi(pagina);
    }

    function editarfila(id) {
        let nombre = document.querySelector("#nombre" + id).innerText;
        document.querySelector("#nombre").value = nombre;

        let apellido = document.querySelector("#apellido" + id).innerText;
        document.querySelector("#apellido").value = apellido;

        let edad = document.querySelector("#edad" + id).innerText;
        document.querySelector("#edad").value = edad;

        let telefono = document.querySelector("#telefono" + id).innerText;
        document.querySelector("#telefono").value = telefono;

        let email = document.querySelector("#email" + id).innerText;
        document.querySelector("#email").value = email;
        let botonEnviar = document.querySelector("#enviarDatos");
        botonEnviar.value = "editar datos";


        let botonCancelarEdicion = document.querySelector("#cancelarEdicion");
        botonCancelarEdicion.addEventListener("click", cancelarEdicion);
        botonCancelarEdicion.innerHTML = "cancelar edicion";

        botonEnviar.removeEventListener("click", agregar);
        botonEnviar.addEventListener("click", function () { completarEdicion(id) });
    }

    async function completarEdicion(id) {
        let nombre = document.querySelector("#nombre").value;
        let apellido = document.querySelector("#apellido").value;
        let edad = document.querySelector("#edad").value;
        let telefono = (document.querySelector("#telefono").value);
        let email = document.querySelector("#email").value;
        let datos = {
            "nombre": nombre,
            "apellido": apellido,
            "edad": edad,
            "telefono": telefono,
            "email": email,
        }
        try {
            let res = await fetch(url + "/" + id, {
                "method": "PUT",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(datos)
            })
            let json = await res.json();
            console.log(json);
            if (res.ok) {
                let botonEnviar = document.querySelector("#enviarDatos");
                cargarApi(pagina);
                console.log(grupos);
                botonEnviar.value = "enviar datos";
                botonEnviar.removeEventListener("click", function () { completarEdicion(id) });
                botonEnviar.addEventListener("click", agregar);
                let botonCancelarEdicion = document.querySelector("#cancelarEdicion");
                botonCancelarEdicion.innerHTML = "restaurar formulario";
            }
        }
        catch (error) {
            console.log(error);
        }
        cancelarEdicion();
    }

    function cancelarEdicion() {
        let nombre = document.querySelector("#nombre");
        nombre.value = "";
        let apellido = document.querySelector("#apellido");
        apellido.value = "";
        let edad = document.querySelector("#edad");
        edad.value = "";
        let telefono = document.querySelector("#telefono");
        telefono.value = "";
        let email = document.querySelector("#email");
        email.value = "";
        let botonEnviar = document.querySelector("#enviarDatos");
        botonEnviar.value = "enviar datos";
        botonEnviar.removeEventListener("click", function () { completarEdicion(id) });
        botonEnviar.addEventListener("click", agregar);
        let botonCancelarEdicion = document.querySelector("#cancelarEdicion");
        botonCancelarEdicion.innerHTML = "restaurar formulario";
    }

    async function agregarLugaresVacios(cantidadDeVacios) {

        for (let i = 0; i < cantidadDeVacios; i++) {
            let datos = {
                "nombre": "necesito compañero",
                "apellido": "-----",
                "edad": "0",
                "telefono": "-----",
                "email": "-----",
            }

            try {
                let res = await fetch(url, {
                    "method": "POST",
                    "headers": { "Content-type": "application/json" },
                    "body": JSON.stringify(datos)
                })
                let json = await res.json();

                console.log(json);
            } catch (error) {
                console.log(error);
            }
        }
        cargarApi(pagina);
    }
}
