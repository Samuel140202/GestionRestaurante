let cart = []; // Carrito de compras

// Función para cargar los productos del inventario desde la base de datos
async function loadInventory() {
    try {
        const response = await fetch('http://localhost:3000/inventario');
        const data = await response.json();

        if (data.success) {
            const menuBody = document.getElementById('inventario-body');
            menuBody.innerHTML = '';

            data.data.forEach(product => {
                const row = document.createElement('tr');

                // Crear cada fila del inventario con un botón de "Añadir al carrito"
                row.innerHTML = `
                    <td>${product.nombre_producto}</td>
                    <td>${product.precio}</td>
                    <td>${product.categoria}</td>
                    <td>${product.descripcion}</td>
                    <td>${product.cantidad}</td>
                    <td><button onclick="addToCart('${product.nombre_producto}', ${product.precio})">Añadir al carrito</button></td>
                `;

                menuBody.appendChild(row);
            });
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error al cargar el inventario:', error);
    }
}

// Función para añadir un producto al carrito
function addToCart(nombreProducto, precio) {
    const existingProduct = cart.find(item => item.nombre_producto === nombreProducto);

    if (existingProduct) {
        existingProduct.cantidad += 1; // Incrementa la cantidad si ya existe
    } else {
        cart.push({ nombre_producto: nombreProducto, precio: precio, cantidad: 1 }); // Agrega el producto al carrito
    }

    updateCartView(); // Actualiza la vista del carrito
}

// Función para actualizar la vista del carrito
function updateCartView() {
    const cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = '';

    cart.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.nombre_producto}</td>
            <td>${product.precio}</td>
            <td>${product.cantidad}</td>
            <td><button onclick="removeFromCart('${product.nombre_producto}')">Eliminar</button></td>
        `;

        cartBody.appendChild(row);
    });
}

// Función para eliminar un producto del carrito
function removeFromCart(productName) {
    cart = cart.filter(product => product.nombre_producto !== productName);
    updateCartView();
}

// Función para confirmar el pedido
async function confirmOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    const clienteIdInput = document.getElementById('cliente-id');
    const clienteId = parseInt(clienteIdInput.value);

    if (isNaN(clienteId) || clienteId <= 0) {
        alert('Por favor, ingresa un ID de cliente válido.');
        return;
    }

    // Crear una lista de productos con nombre y cantidad para enviar al servidor
    const productos = cart.map(item => ({
        nombre_producto: item.nombre_producto,
        cantidad: item.cantidad,
        precio: item.precio
    }));

    const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    const orderData = {
        cliente_id: clienteId,  // Usa el ID del cliente ingresado
        productos: productos,
        total: total
    };

    try {
        const response = await fetch('http://localhost:3000/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        if (result.success) {
            alert('¡Pedido confirmado!');
            // Limpiar el carrito y actualizar la vista
            cart = [];
            updateCartView();

            // Limpiar el campo de cliente ID
            clienteIdInput.value = '';

            // Recargar la página
            location.reload();
        } else {
            alert('Error al confirmar el pedido: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al confirmar el pedido');
    }
}

// Llama a la función al cargar la página
window.onload = () => {
    loadInventory();

    // Agrega un evento al botón de confirmar pedido
    document.getElementById('confirm-order').addEventListener('click', confirmOrder);
};
