/**
 * OMNI-CALCULADORA: Lógica Unificada para 5 Motores
 * Este script adapta las peticiones según el backend seleccionado.
 */

// 1. Configuración de URLs Base
const URLS_BASE = {
    java: "https://calculadora-java-kykd.onrender.com/api",
    express: "https://tarea6-calculadora-node-js-express.onrender.com/api",
    fastapi: "https://tarea6-calculadora-pythonfastapi.onrender.com",
    php: "https://tarea6-calculadora-php.onrender.com"
};

// 2. Configuración para el Modo Agnóstico (12 Microservicios independientes)
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

/**
 * Función Principal de Ejecución
 * @param {string} metodo - 'PATH', 'QUERY' o 'BODY'
 * @param {string} operacion - 'suma', 'resta', 'multiplicacion' o 'division'
 */
async function ejecutar(metodo, operacion) {
    const motor = document.getElementById('motor').value;
    
    // Soporte para diferentes IDs de inputs según tus versiones previas
    const valA = document.getElementById('numA')?.value || document.getElementById('n1')?.value || 0;
    const valB = document.getElementById('numB')?.value || document.getElementById('n2')?.value || 0;
    const display = document.getElementById('display') || document.getElementById('resultado');
    
    let url = "";
    let options = { method: 'GET' };
    
    display.innerHTML = "<em>Procesando...</em>";

    try {
        // --- CASO 1: MODO AGNÓSTICO ---
        if (motor === 'agnostico') {
            const endpoint = URLS_AGNOSTICO[operacion][metodo.toLowerCase()];
            if (metodo === 'PATH') {
                url = `${endpoint}/${valA}/${valB}`;
            } else if (metodo === 'QUERY') {
                url = `${endpoint}?n1=${valA}&n2=${valB}`;
            } else {
                url = endpoint;
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ n1: valA, n2: valB })
                };
            }
        } 
        
        // --- CASO 2: PYTHON (FASTAPI) ---
        else if (motor === 'fastapi') {
            // Traducción de nombres de operación para Python
            const opPy = operacion === 'multiplicacion' ? 'multi' : (operacion === 'division' ? 'divi' : operacion);
            
            if (metodo === 'PATH') {
                url = `${URLS_BASE.fastapi}/${opPy}/${valA}/${valB}`;
            } else if (metodo === 'QUERY') {
                url = `${URLS_BASE.fastapi}/${opPy}?n1=${valA}&n2=${valB}`;
            } else {
                url = `${URLS_BASE.fastapi}/${opPy}`;
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ n1: parseFloat(valA), n2: parseFloat(valB) })
                };
            }
        }

        // --- CASO 3: PHP (PURO) ---
        else if (motor === 'php') {
            if (metodo === 'PATH') {
                url = `${URLS_BASE.php}/${operacion}/${valA}/${valB}`;
            } else if (metodo === 'QUERY') {
                url = `${URLS_BASE.php}?op=${operacion}&a=${valA}&b=${valB}`;
            } else {
                url = URLS_BASE.php; // index.php recibe el body
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ op: operacion, a: parseFloat(valA), b: parseFloat(valB) })
                };
            }
        }

        // --- CASO 4: EXPRESS (NODE.JS) ---
       else if (motor === 'express') {
    // 1. Quitamos el /api porque tus rutas de Express van directo (ej: /suma/6/2)
    const baseUrl = "https://tarea6-calculadora-node-js-express.onrender.com";
    
    // 2. Traducción de nombres si es necesario (ej: multiplicacion -> multi)
    const opEx = operacion === 'multiplicacion' ? 'multi' : (operacion === 'division' ? 'divi' : operacion);

    if (metodo === 'PATH') {
        url = `${baseUrl}/${opEx}/${valA}/${valB}`;
    } else if (metodo === 'QUERY') {
        url = `${baseUrl}/${opEx}?n1=${valA}&n2=${valB}`;
    } else {
        url = `${baseUrl}/${opEx}`;
        options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ n1: valA, n2: valB })
        };
    }
}
        // --- CASO 5: JAVA (SPRING BOOT) - No se modifica su lógica original ---
        else {
            if (metodo === 'PATH') {
                url = `${URLS_BASE.java}/${operacion}/path/${valA}/${valB}`;
            } else if (metodo === 'QUERY') {
                url = `${URLS_BASE.java}/${operacion}/query?a=${valA}&b=${valB}`;
            } else {
                url = `${URLS_BASE.java}/${operacion}/body`;
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ a: parseFloat(valA), b: parseFloat(valB) })
                };
            }
        }

        // Ejecución de la petición
        console.log(`Llamando a [${motor}]:`, url);
        const res = await fetch(url, options);
        
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        const data = await res.json();
        
        // Normalización de respuesta (soporta {resultado: X} o el número directo)
        const finalResult = data.resultado !== undefined ? data.resultado : data;
        display.innerHTML = `<strong>Resultado:</strong> ${finalResult}`;

    } catch (err) {
        display.innerHTML = `<span style="color:red;">Error de conexión</span>`;
        console.error("Error en la petición:", err);
    }
}
