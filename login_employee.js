document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const identifier = document.getElementById('identifier').value; // Obtener el usuario o correo
    const password = document.getElementById('password').value; // Obtener la contraseña

    try {
        const response = await fetch('http://localhost:3000/login_employee', { // Asegúrate de que el puerto sea correcto
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifier, password }) // Enviar datos como JSON
        });

        const result = await response.json(); // Convertir la respuesta a JSON
        const errorMessage = document.getElementById('error-message'); // Obtener el elemento para mostrar mensajes de error

        if (result.success) {
            errorMessage.textContent = '¡Inicio de sesión exitoso!';
            errorMessage.style.color = 'green';
            window.location.href = 'inicio_empleado.html'; // Redirigir a la página de éxito
        } else {
            errorMessage.textContent = result.message; // Mostrar el mensaje de error
            errorMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error); // Manejar errores en la solicitud
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Error al comunicarse con el servidor.'; // Mensaje de error genérico
        errorMessage.style.color = 'red';
    }
});
