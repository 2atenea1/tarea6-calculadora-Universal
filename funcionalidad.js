// EL DICCIONARIO DE TUS MICROSERVICIOS
const SERVIDORES = {
    java: "https://calculadora-java-kykd.onrender.com",
    express: "https://tarea6-calculadora-node-js-express.onrender.com",    
    fastapi: "https://tarea6-calculadora-pythonfastapi.onrender.com", 
    php: "https://tarea6-calculadora-php.onrender.com",      
    agnostico: ""             
};

// Función decorativa para que la pantalla cambie según el servidor
function cambiarEstilo() {
    const motor = document.getElementById('motor').value;
    const indicador = document.getElementById('indicador-servidor');
    
    indicador.innerText = "Modo activo: " + motor.toUpperCase();
    
    // Opcional: Cambiar colores según el lenguaje
    const colores = {
        java: "#ff8411",
        express: "#60ff52",
        fastapi: "#12aa9b",
        php: "#97a2d1",
        agnostico: "#5ec1f3"
    };
    indicador.style.backgroundColor = colores[motor];
}

// Inicializar el color al cargar la página
cambiarEstilo();

// LA FUNCIÓN UNIVERSAL
function ejecutarOperacion(operacion) {
    const motorSeleccionado = document.getElementById('motor').value;
    const baseUrl = SERVIDORES[motorSeleccionado];
    
    const a = document.getElementById('numA').value;
    const b = document.getElementById('numB').value;

    // Construimos la URL asumiendo que todos tus backends usan la estructura /operacion/path/a/b
    // (Ejemplo: /suma/path/4/5)
    let url = `${baseUrl}/${operacion}/path/${a}/${b}`;
    
    console.log(`Llamando al servidor ${motorSeleccionado.toUpperCase()} en:`, url);
    document.getElementById('display').innerText = "Calculando...";

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error en el servidor: " + response.status);
            return response.json();
        })
        .then(data => {
            // Asumimos que todos los backends devuelven el JSON en el formato {"resultado": X}
            document.getElementById('display').innerText = "Resultado: " + data.resultado;
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById('display').innerText = `Error al conectar con ${motorSeleccionado}`;
        });
}