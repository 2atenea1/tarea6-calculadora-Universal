// 1. Enlaces para los motores que tienen todo en un mismo servicio
const MOTORES_UNIFICADOS = {
    java: "https://calculadora-java-kykd.onrender.com/api",
    express: "https://tarea6-calculadora-node-js-express.onrender.com/api",
    fastapi: "https://tarea6-calculadora-pythonfastapi.onrender.com/api",
    php: "https://tarea6-calculadora-php.onrender.com/api"
};

// 2. Enlaces específicos para el modo Agnóstico (Fragmentado)
const MICROSERVICIOS_NODE = {
    suma: {
        path: "https://calculadora-path-astrid.onrender.com",
        query: "https://calculadora-query-astrid.onrender.com",
        body: "https://calculadora-body-astrid.onrender.com"
    },
    resta: {
        path: "https://tarea6-microserviciossuma.onrender.com",
        query: "https://calculadora-resta-query.onrender.com",
        body: "https://calculadora-resta-body.onrender.com"
    },
    multiplicacion: {
        path: "https://calculadora-multi-path.onrender.com",
        query: "https://calculadora-multi-query.onrender.com",
        body: "https://calculadora-multi-body.onrender.com"
    },
    division: {
        path: "https://calculadora-divi-path.onrender.com",
        query: "https://calculadora-divi-query.onrender.com",
        body: "https://calculadora-divi-body.onrender.com"
    }
};

function ejecutar(metodo, operacion) {
    const motor = document.getElementById('motor').value;
    const a = document.getElementById('numA').value || 0;
    const b = document.getElementById('numB').value || 0;
    const display = document.getElementById('display');
    const status = document.getElementById('status-url');

    let url = "";
    let options = { method: 'GET' };
    display.innerText = "Calculando...";

    // Lógica de construcción de URL
    if (motor === 'agnostico') {
        const base = MICROSERVICIOS_NODE[operacion][metodo.toLowerCase()];
        if (metodo === 'PATH') url = `${base}/${a}/${b}`;
        else if (metodo === 'QUERY') url = `${base}/?a=${a}&b=${b}`;
        else { // BODY (POST)
            url = `${base}/`;
            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a: parseFloat(a), b: parseFloat(b) })
            };
        }
    } else {
        const base = MOTORES_UNIFICADOS[motor];
        if (metodo === 'PATH') url = `${base}/${operacion}/path/${a}/${b}`;
        else if (metodo === 'QUERY') url = `${base}/${operacion}/query?a=${a}&b=${b}`;
        else { // BODY (POST)
            url = `${base}/${operacion}/body`;
            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a: parseFloat(a), b: parseFloat(b) })
            };
        }
    }

    status.innerText = "URL: " + url;

    fetch(url, options)
        .then(res => {
            if (!res.ok) throw new Error("Error en la respuesta");
            return res.json();
        })
        .then(data => {
            display.innerText = "Resultado: " + data.resultado;
        })
        .catch(err => {
            console.error(err);
            display.innerText = "Error de conexión";
        });
}

function actualizarInterfaz() {
    const motor = document.getElementById('motor').value;
    const card = document.getElementById('main-card');
    
    // Colores temáticos para cada motor
    const colores = {
        java: '#f89820',      // Naranja Java
        express: '#68a063',   // Verde Node
        fastapi: '#05998b',   // Teal FastAPI
        php: '#777bb4',       // Violeta PHP
        agnostico: '#ffffff'  // Blanco para Agnóstico
    };

    card.style.backgroundColor = colores[motor];

    // Ajustamos el color del texto para que siempre sea legible
    if (motor === 'agnostico') {
        card.classList.remove('modo-oscuro');
    } else {
        card.classList.add('modo-oscuro');
    }
}

// Iniciar con el color de Java por defecto
actualizarInterfaz();