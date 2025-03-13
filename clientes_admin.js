// Cargar clientes al cargar la página
document.addEventListener('DOMContentLoaded', loadClients);

const clientModal = document.getElementById('clientModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.querySelector('.close-button');

// Función para mostrar el modal
function openModal() {
    clientModal.style.display = 'flex';
}

// Función para ocultar el modal y restablecer el formulario
function closeModal() {
    clientModal.style.display = 'none';
    resetForm();
}

// Event listeners para abrir y cerrar el modal
openModalButton.addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Agregar Cliente';
    openModal();
});

closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === clientModal) {
        closeModal();
    }
});

// Función para cargar los clientes en la tabla
async function loadClients() {
    try {
        const response = await fetch('http://localhost:3000/clientes');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al cargar clientes');
        }

        const clientsBody = document.getElementById('clients-body');
        clientsBody.innerHTML = '';

        data.data.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id_clientes}</td>
                <td>${client.nombre}</td>
                <td>${client.apellido}</td>
                <td>${client.email}</td>
                <td>${client.usuario}</td>
                <td>
                    <button onclick="editClient(${client.id_clientes})">Editar</button>
                    <button onclick="deleteClient(${client.id_clientes})">Eliminar</button>
                </td>
            `;
            clientsBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        alert('Error al cargar los clientes');
    }
}

// Función para guardar o editar un cliente
document.getElementById('clientForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_clientes = document.getElementById('clientId').value;
    const nombre = document.getElementById('clientName').value.trim();
    const apellido = document.getElementById('clientLastName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const usuario = document.getElementById('clientUsername').value.trim();
    const password = document.getElementById('clientPassword').value.trim();

    if (!nombre || !apellido || !email || !usuario || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const clientData = { nombre, apellido, email, usuario, password };

    const url = id_clientes ? `http://localhost:3000/clientes/${id_clientes}` : 'http://localhost:3000/clientes';
    const method = id_clientes ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });

        if (response.ok) {
            loadClients();
            closeModal();
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Error al guardar el cliente');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al guardar el cliente');
    }
});

// Función para restablecer el formulario
function resetForm() {
    document.getElementById('formTitle').textContent = 'Agregar Cliente';
    document.getElementById('clientForm').reset();
    document.getElementById('clientId').value = '';
    document.getElementById('clientPassword').value = ''; // Limpia el campo de contraseña
}

// Función para editar un cliente
async function editClient(id_clientes) {
    try {
        const response = await fetch(`http://localhost:3000/clientes/${id_clientes}`);
        const result = await response.json();
        const client = result.data;

        if (client) {
            document.getElementById('formTitle').textContent = 'Editar Cliente';
            document.getElementById('clientId').value = client.id_clientes;
            document.getElementById('clientName').value = client.nombre;
            document.getElementById('clientLastName').value = client.apellido;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientUsername').value = client.usuario;
            document.getElementById('clientPassword').value = ''; // Vaciar el campo contraseña para que se ingrese de nuevo

            openModal();
        } else {
            alert('Cliente no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener los detalles del cliente:', error);
        alert('Error al obtener los detalles del cliente');
    }
}

// Función para eliminar un cliente
async function deleteClient(id_clientes) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:3000/clientes/${id_clientes}`, { method: 'DELETE' });

            if (response.ok) {
                loadClients();
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message || 'Error al eliminar el cliente');
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('Hubo un problema al eliminar el cliente');
        }
    }
}
