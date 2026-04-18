// 1. Configuración de URLs Base
const URLS_BASE = {
    java: "https://calculadora-java-kykd.onrender.com/api",
    express: "https://tarea6-calculadora-node-js-express.onrender.com", // Sin /api
    fastapi: "https://tarea6-calculadora-pythonfastapi.onrender.com",
    php: "https://tarea6-calculadora-php.onrender.com"
};

// 2. Configuración para el Modo Agnóstico
const URLS_AGNOSTICO = {
    suma: {
        path: "https://calculadora-path-astrid.onrender.com/suma",
        query: "https://calculadora-query-astrid.onrender.com/suma",
        body: "https://calculadora-body-astrid.onrender.com/suma"
    },
    resta: {
        path: "https://tarea6-microserviciossuma.onrender.com/resta",
        query: "https://calculadora-resta-query.onrender.com/resta",
        body: "https://calculadora-resta-body.onrender.com/resta"
    },
    multiplicacion: {
        path: "https://calculadora-multi-path.onrender.com/multi",
        query: "https://calculadora-multi-query.onrender.com/multi",
        body: "https://calculadora-multi-body.onrender.com/multi"
    },
    division: {
        path: "https://calculadora-divi-path.onrender.com/divi",
        query: "https://calculadora-divi-query.onrender.com/divi",
        body: "https://calculadora-divi-body.onrender.com/divi"
    }
};

// --- FUNCIÓN PARA EJECUTAR OPERACIONES ---
async function ejecutar(metodo, operacion) {
    const motor = document.getElementById('motor').value;
    const valA = document.getElementById('numA').value || 0;
    const valB = document.getElementById('numB').value || 0;
    const display = document.getElementById('display');
    
    let url = "";
    let options = { method: 'GET' };
    display.innerHTML = "<em>Procesando...</em>";

    try {
        if (motor === 'agnostico') {
            const endpoint = URLS_AGNOSTICO[operacion][metodo.toLowerCase()];
            if (metodo === 'PATH') url = `${endpoint}/${valA}/${valB}`;
            else if (metodo === 'QUERY') url = `${endpoint}?n1=${valA}&n2=${valB}`;
            else {
                url = endpoint;
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ n1: valA, n2: valB })
                };
            }
        } 
        else if (motor === 'fastapi' || motor === 'express') {
            // Ambos usan n1/n2 y rutas como /suma /resta /multi /divi
            const baseUrl = URLS_BASE[motor];
            const opCorta = operacion === 'multiplicacion' ? 'multi' : (operacion === 'division' ? 'divi' : operacion);
            
            if (metodo === 'PATH') url = `${baseUrl}/${opCorta}/${valA}/${valB}`;
            else if (metodo === 'QUERY') url = `${baseUrl}/${opCorta}?n1=${valA}&n2=${valB}`;
            else {
                url = `${baseUrl}/${opCorta}`;
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ n1: parseFloat(valA), n2: parseFloat(valB) })
                };
            }
        }
        else if (motor === 'php') {
            if (metodo === 'PATH') url = `${URLS_BASE.php}/${operacion}/${valA}/${valB}`;
            else if (metodo === 'QUERY') url = `${URLS_BASE.php}?op=${operacion}&a=${valA}&b=${valB}`;
            else {
                url = URLS_BASE.php;
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ op: operacion, a: parseFloat(valA), b: parseFloat(valB) })
                };
            }
        }
        else { // Java
            if (metodo === 'PATH') url = `${URLS_BASE.java}/${operacion}/path/${valA}/${valB}`;
            else if (metodo === 'QUERY') url = `${URLS_BASE.java}/${operacion}/query?a=${valA}&b=${valB}`;
            else {
                url = `${URLS_BASE.java}/${operacion}/body`;
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ a: parseFloat(valA), b: parseFloat(valB) })
                };
            }
        }

        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const resultado = data.resultado !== undefined ? data.resultado : data;
        display.innerHTML = `<strong>Resultado:</strong> ${resultado}`;

    } catch (err) {
        display.innerHTML = `<span style="color:red;">Error de conexión</span>`;
        console.error(err);
    }
}

// --- FUNCIÓN PARA CAMBIAR EL FONDO SEGÚN EL MOTOR ---
function actualizarInterfaz() {
    const motor = document.getElementById('motor').value;
    const card = document.getElementById('main-card');
    
    const colores = {
        java: '#f89820',      // Naranja
        express: '#339933',   // Verde
        fastapi: '#05998b',   // Teal
        php: '#777bb4',       // Morado
        agnostico: '#455a64'  // Gris
    };

    if (card) {
        card.style.transition = "all 0.5s ease"; // Para que el cambio sea suave
        card.style.backgroundColor = colores[motor];
        
        // Cambiamos el color de todo el texto a blanco para que resalte sobre el fondo
        card.style.color = "white";

        // Opcional: Ajustamos los inputs para que se sigan viendo blancos
        const inputs = card.querySelectorAll('input');
        inputs.forEach(inp => {
            inp.style.backgroundColor = "white";
            inp.style.color = "black";
            inp.style.border = "none";
        });
    }
}

// Inicializar al cargar
window.onload = actualizarInterfaz;
