let pagina = 1;

const turno = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Restalta el div actual segun el tab que esta presionado
    mostrarSeccion();

    // Oculta o muestra una seccion segun el tab que esta presionado
    cambiarSeccion();

    // Paginacion
    paginaSiguiente();

    paginaAnterior();

    // Comprueba la pagina actual para mostrar u ocultar la paginacion
    botonesPaginador();

    // Muestra el resumen del turno o mensaje de error si no pasa la validacion
    mostrarResumen();
}

function mostrarSeccion() {
    //Eliminar 'mostrar-seccion' de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resaltar el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // COMENTO TODO ESE CODIGO PORQUE ESTA DEFINIDO MAS ARRIBA, LO TENIA ANTES PARA HACERLO SIN LA PAGINACION

            // //Eliminar 'mostrar-seccion' de la seccion anterior
            // document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

            // //Agrega mostrar-seccion donde dimos click
            // const seccion = document.querySelector(`#paso-${pagina}`);
            // seccion.classList.add('mostrar-seccion');

            // // Eliminar la clase actual en el tab anterior
            // document.querySelector('.tabs .actual').classList.remove('actual');

            // // Agregar la clase actual en el nuevo tab
            // const tab = document.querySelector(`[data-paso="${pagina}"]`);
            // tab.classList.add('actual');

            // Llamar a la funcion de mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;

        // Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            // DOM Scripting
            // Generar nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor de servicios
            const divServicio = document.createElement('DIV');
            divServicio.classList.add('servicio');
            divServicio.dataset.idServicio = id;

            // Selecciona un servicio para el turno
            divServicio.onclick = seleccionarServicio;

            // Inyectar precio y nombre al div contenedor
            divServicio.appendChild(nombreServicio);
            divServicio.appendChild(precioServicio);

            // Inyectar en HTML mediante el div con id 'servicios'
            document.querySelector('#servicios').appendChild(divServicio);
        })
    } catch(error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    // Forzar que el elemento al que se le da click sea el div
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }
    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, servicios } = turno;

    // Seleccionar el resumen
    const divResumen = document.querySelector('.contenido-resumen');

    // Validacion de objeto
    if(Object.values(turno).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, nombre, fecha u hora';
        noServicios.classList.add('invalidar-turno');

        // Agregar a divResumen
        divResumen.appendChild(noServicios);
    }
}