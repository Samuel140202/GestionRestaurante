// menufunciones.js

// Función para cargar los productos del menú desde la base de datos
async function loadMenu() {
    try {
        const response = await fetch('http://localhost:3000/menu'); // URL de tu servidor
        const data = await response.json();

        if (data.success) {
            const menuBody = document.getElementById('menu-body'); // Obtén el cuerpo de la tabla

            // Limpia el contenido actual del cuerpo de la tabla
            menuBody.innerHTML = '';

            // Itera sobre los datos y crea filas de tabla
            data.data.forEach(product => {
                const row = document.createElement('tr'); // Crea una nueva fila

                // Crea las celdas y las agrega a la fila
                row.innerHTML = `
                   
                    <td>${product.nombre_producto}</td>
                    <td>${product.precio}</td>
                    <td>${product.categoria}</td>
                    <td>${product.descripcion}</td>
                `;

                menuBody.appendChild(row); // Agrega la fila al cuerpo de la tabla
            });
        } else {
            console.error(data.message); // Maneja errores
        }
    } catch (error) {
        console.error('Error al cargar el menú:', error); // Maneja errores de red
    }
}

// Llama a la función al cargar la página
window.onload = loadMenu;
