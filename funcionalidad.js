// 1. MOTORES UNIFICADOS (Una sola URL base para todas las operaciones)
const MOTORES_UNIFICADOS = {
    java: "https://calculadora-java-kykd.onrender.com/api",
    express: "https://tarea6-calculadora-node-js-express.onrender.com/api",
    fastapi: "https://tarea6-calculadora-pythonfastapi.onrender.com/api",
    php: "https://tarea6-calculadora-php.onrender.com/api"
};

// 2. MOTOR AGNÓSTICO (Cada operación y método es un enlace distinto en Render)
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
    const motorActivo = document.getElementById('motor').value;
    const numA = document.getElementById('numA').value;
    const numB = document.getElementById('numB').value;
    const display = document.getElementById('display');
    const statusUrl = document.getElementById('status-url');

    let urlFinal = "";
    let configuracion = { method: 'GET' };

    display.innerText = "Procesando...";

    // Lógica para el modo Agnóstico (Microservicios independientes)
    if (motorActivo === 'agnostico') {
        const baseMicro = MICROSERVICIOS_NODE[operacion][metodo.toLowerCase()];
        
        if (metodo === 'PATH') {
            urlFinal = `${baseMicro}/${numA}/${numB}`;
        } else if (metodo === 'QUERY') {
            urlFinal = `${baseMicro}/?a=${numA}&b=${numB}`;
        } else if (metodo === 'BODY') {
            urlFinal = `${baseMicro}/`;
            configuracion = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a: parseFloat(numA), b: parseFloat(numB) })
            };
        }
    } 
    // Lógica para los otros 4 motores unificados
    else {
        const baseUnificada = MOTORES_UNIFICADOS[motorActivo];
        
        if (metodo === 'PATH') {
            urlFinal = `${baseUnificada}/${operacion}/path/${numA}/${numB}`;
        } else if (metodo === 'QUERY') {
            urlFinal = `${baseUnificada}/${operacion}/query?a=${numA}&b=${numB}`;
        } else if (metodo === 'BODY') {
            urlFinal = `${baseUnificada}/${operacion}/body`;
            configuracion = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a: parseFloat(numA), b: parseFloat(numB) })
            };
        }
    }

    statusUrl.innerText = "URL: " + urlFinal;

    // Realizar la petición fetch
    fetch(urlFinal, configuracion)
        .then(res => {
            if (!res.ok) throw new Error("Error " + res.status);
            return res.json();
        })
        .then(data => {
            // Se asume que todos retornan {"resultado": valor}
            display.innerText = "Resultado: " + data.resultado;
        })
        .catch(err => {
            console.error("Fallo:", err);
            display.innerText = "Error de conexión";
        });
}

function actualizarInterfaz() {
    const motor = document.getElementById('motor').value;
    const card = document.getElementById('main-card');
    
    // Colores temáticos por motor
    const temas = {
        java: '#ff8c00',      // Naranja Java
        express: '#15ff00',   // Verde Node
        fastapi: '#00ffe5',   // Teal FastAPI
        php: '#696da8',       // Violeta PHP
        agnostico: '#4b4848'  // Gris oscuro
    };
    
    card.style.borderTop = `10px solid ${temas[motor]}`;
}

// Ejecutar al cargar para poner el color inicial
actualizarInterfaz();