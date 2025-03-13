// Función para cargar los pedidos desde la base de datos
async function loadPedidos() {
    try {
        const response = await fetch('http://localhost:3000/pedidos'); // URL de la ruta
        const data = await response.json();

        if (data.success) {
            const pedidosBody = document.getElementById('pedidos-body'); // Cuerpo de la tabla

            // Limpia el contenido actual del cuerpo de la tabla
            pedidosBody.innerHTML = '';

            // Itera sobre los datos y crea filas de tabla
            data.data.forEach(pedido => {
                const row = document.createElement('tr');

                // Crea las celdas y las agrega a la fila
                row.innerHTML = `
                    <td>${pedido.id}</td>
                    <td>${pedido.cliente_id}</td>
                    <td>${JSON.stringify(pedido.productos)}</td>
                    <td>${pedido.total}</td>
                    <td>${pedido.fecha_pedido}</td>
                `;

                pedidosBody.appendChild(row); // Agrega la fila al cuerpo de la tabla
            });
        } else {
            console.error(data.message); // Maneja errores
        }
    } catch (error) {
        console.error('Error al cargar los pedidos:', error); // Maneja errores de red
    }
}

// Llama a la función al cargar la página
window.onload = loadPedidos;
