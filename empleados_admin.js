// Cargar empleados al cargar la página
document.addEventListener('DOMContentLoaded', loadEmployees);

const employeeModal = document.getElementById('employeeModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.querySelector('.close-button');

// Función para mostrar el modal
function openModal() {
    employeeModal.style.display = 'flex';
}

// Función para ocultar el modal y restablecer el formulario
function closeModal() {
    employeeModal.style.display = 'none';
    resetForm();
}

// Event listeners para abrir y cerrar el modal
openModalButton.addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Agregar Empleado';
    openModal();
});

closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === employeeModal) {
        closeModal();
    }
});

// Función para cargar los empleados en la tabla
async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:3000/empleados');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al cargar empleados');
        }

        const employeesBody = document.getElementById('employees-body');
        employeesBody.innerHTML = '';

        data.data.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.nombre}</td>
                <td>${employee.apellido}</td>
                <td>${employee.email}</td>
                <td>${employee.usuario}</td> <!-- Mostrar usuario -->
                <td>${employee.password}</td>
                <td>
                    <button onclick="editEmployee(${employee.id})">Editar</button>
                    <button onclick="deleteEmployee(${employee.id})">Eliminar</button>
                </td>
            `;
            employeesBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        alert('Error al cargar los empleados');
    }
}

// Función para guardar o editar un empleado
document.getElementById('employeeForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('employeeId').value;
    const nombre = document.getElementById('employeeName').value.trim();
    const apellido = document.getElementById('employeeLastName').value.trim();
    const email = document.getElementById('employeeEmail').value.trim();
    const usuario = document.getElementById('employeeUsername').value.trim();
    const password = document.getElementById('employeePassword').value.trim();

    if (!nombre || !apellido || !email || !usuario || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const employeeData = { nombre, apellido, email, usuario, password };

    const url = id ? `http://localhost:3000/empleados/${id}` : 'http://localhost:3000/empleados';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });

        if (response.ok) {
            loadEmployees();
            closeModal();
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Error al guardar el empleado');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al guardar el empleado');
    }
});

// Función para restablecer el formulario
function resetForm() {
    document.getElementById('formTitle').textContent = 'Agregar Empleado';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
    document.getElementById('employeePassword').value = ''; // Limpia el campo de contraseña
}

// Función para editar un empleado
async function editEmployee(id) {
    try {
        const response = await fetch(`http://localhost:3000/empleados/${id}`);
        const result = await response.json();
        const employee = result.data;

        if (employee) {
            document.getElementById('formTitle').textContent = 'Editar Empleado';
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('employeeName').value = employee.nombre;
            document.getElementById('employeeLastName').value = employee.apellido;
            document.getElementById('employeeEmail').value = employee.email;
            document.getElementById('employeeUsername').value = employee.usuario;
            document.getElementById('employeePassword').value = ''; // Vaciar el campo contraseña para que se ingrese de nuevo

            openModal();
        } else {
            alert('Empleado no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener los detalles del empleado:', error);
        alert('Error al obtener los detalles del empleado');
    }
}

// Función para eliminar un empleado
async function deleteEmployee(id) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este empleado?');
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:3000/empleados/${id}`, { method: 'DELETE' });

            if (response.ok) {
                loadEmployees();
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message || 'Error al eliminar el empleado');
            }
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            alert('Hubo un problema al eliminar el empleado');
        }
    }
}
