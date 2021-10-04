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

    // Almacenar el nombre del turno
    nombreTurno();

    // Almacena la fecha del turno
    fechaTurno();

    // Almacenar la hora del turno
    horaTurno();

    // Deshabilitar dias anteriores 
    // deshabilitarDias();   (reever porque no funciona)
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

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio), 
            nombre: elemento.firstElementChild.textContent, // Tomo el primer hijo del div padre del html
            precio: elemento.firstElementChild.nextElementSibling.textContent // Tomo el hijo que le sigue con la funcion Sibling
        }
        agregarServicio(servicioObj);
    }
}

function agregarServicio(obj) {
    const { servicios } = turno;
    turno.servicios = [...servicios, obj];
}

function eliminarServicio(id) {
    const { servicios } = turno;
    turno.servicios = servicios.filter(servicio => servicio.id !== id);

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
        mostrarResumen(); // Mostrar el resumen del turno en la pagina 3
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

    //Limpiar el HTML previo
    while(divResumen.firstChild) {
        divResumen.removeChild(divResumen.firstChild);
    };

    // Validacion de objeto
    if(Object.values(turno).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, nombre, fecha u hora';
        noServicios.classList.add('invalidar-turno');

        // Agregar a divResumen
        divResumen.appendChild(noServicios);
        return;
    }

    const headingTurno = document.createElement('H3');
    headingTurno.textContent = 'Resumen del turno'
    // Mostrar resumen
    const nombreTurno = document.createElement('P');
    nombreTurno.innerHTML = `<span>Nombre:</span> ${nombre}`;
    const fechaTurno = document.createElement('P');
    fechaTurno.innerHTML = `<span>Fecha:</span> ${fecha}`;
    const horaTurno = document.createElement('P');
    horaTurno.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosTurno = document.createElement('DIV');
    serviciosTurno.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';

    serviciosTurno.appendChild(headingServicios);

    let cantidad = 0;

    //Iterar sobre el arreglo de servicios para mostrarlos en el resumen
    servicios.forEach(servicio => {
        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicios = precio.split('$');
        cantidad += parseInt(totalServicios[1].trim());

        // Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosTurno.appendChild(contenedorServicio);
    });



    //Agregar a divResumen
    divResumen.appendChild(headingTurno);
    divResumen.appendChild(nombreTurno);
    divResumen.appendChild(fechaTurno);
    divResumen.appendChild(horaTurno);
    divResumen.appendChild(serviciosTurno);

    const totalAPagar = document.createElement('P');
    totalAPagar.classList.add('total');
    totalAPagar.innerHTML = `<span>Total a Pagar:</span> $ ${cantidad}`;
    if(cantidad === 0) {
        const sinServicios = document.createElement('P');
        sinServicios.textContent = 'No hay servicios seleccionados para el turno';
        sinServicios.classList.add('sin-servicios');
        headingServicios.appendChild(sinServicios);
        return;
    }
    divResumen.appendChild(totalAPagar);
}

function nombreTurno() {
    const inputNombre = document.querySelector('#nombre');
    inputNombre.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        // Validacion de que el input nombre no debe ser espacios en blanco o vacio
        if(nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('El nombre debe tener al menos 3 caracteres', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            turno.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo) {
    // Si hay una alerta previa no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    //Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar la alerta despues de 3 segundos
    setTimeout(() =>{
        alerta.remove();
    }, 5000);
}

function fechaTurno() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const fecha = new Date(e.target.value).getUTCDay();
        if([0, 6].includes(fecha)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana cerrado', 'error');
        } else {
            turno.fecha = fechaInput.value;
        }
    })
}

function horaTurno() {
    const horaInput = document.querySelector('#hora');
    horaInput.addEventListener('input', e => {
        const horaTurno = e.target.value;
        const hora = horaTurno.split(':');
        if(hora[0] < 10 || hora[0] > 20) {
            mostrarAlerta('Abrimos de 10:00 a 20:00hs', 'error');
            setTimeout(() => {
                horaInput.value = ''; 
            }, 3000);
        } else {
            turno.hora = horaTurno;
        }
    })
}

// function deshabilitarDias() {
//     const fechaActual = new Date();
//     const dia = fechaActual.getDate();
//     var _mes = fechaActual.getMonth();
//     _mes = _mes + 1;
//     if(_mes < 10) {
//         var mes = '0' + _mes;
//     } else {
//         var mes = _mes.toString();
//     }
//     const year = fechaActual.getFullYear();

//     // Formato deseado: DD-MM-AAAA
//     const fechaVieja = `${dia}-${mes}-${year}`;
//     document.getElementById("#fecha").min = fechaVieja; 
// }