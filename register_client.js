document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const newUsername = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('register-error-message');

    // Validación de contraseñas
    if (newPassword !== confirmPassword) {
        errorMessage.textContent = 'Las contraseñas no coinciden.';
        errorMessage.style.color = 'red';
        return;
    }

    // Validación de campos vacíos
    if (!nombre || !apellido || !newUsername || !email || !newPassword) {
        errorMessage.textContent = 'Todos los campos son obligatorios.';
        errorMessage.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register_client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nombre, 
                apellido, 
                usuario: newUsername, 
                email, 
                password: newPassword 
            })
        });

        const result = await response.json();
        if (result.success) {
            errorMessage.textContent = '¡Registro exitoso!';
            errorMessage.style.color = 'green';
            window.location.href = 'login_client.html'; // Redirige al login de cliente
        } else {
            errorMessage.textContent = result.message;
            errorMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        errorMessage.textContent = 'Error al comunicarse con el servidor.';
        errorMessage.style.color = 'red';
    }
});
