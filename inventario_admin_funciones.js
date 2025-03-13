document.addEventListener('DOMContentLoaded', loadInventory);

const productModal = document.getElementById('productModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.querySelector('.close-button');

// Función para mostrar el modal
function openModal() {
    productModal.style.display = 'flex';
}

// Función para ocultar el modal
function closeModal() {
    productModal.style.display = 'none';
    resetForm();
}

// Event listeners para abrir y cerrar el modal
openModalButton.addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Agregar Producto';
    openModal();
});

closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === productModal) {
        closeModal();
    }
});

async function loadInventory() {
    try {
        const response = await fetch('http://localhost:3000/inventario');
        const data = await response.json();

        const inventoryBody = document.getElementById('inventory-body');
        inventoryBody.innerHTML = '';

        data.data.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.nombre_producto}</td>
                <td>${product.precio}</td>
                <td>${product.categoria}</td>
                <td>${product.descripcion}</td>
                <td>${product.cantidad}</td>
                <td>
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                </td>
            `;
            inventoryBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar inventario:', error);
        alert('Error al cargar los productos del inventario');
    }
}

document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('productId').value;
    const nombre = document.getElementById('productName').value.trim();
    const precio = document.getElementById('productPrice').value.trim();
    const categoria = document.getElementById('productCategory').value.trim();
    const descripcion = document.getElementById('productDescription').value.trim();
    const cantidad = document.getElementById('productQuantity').value.trim();

    if (!nombre || !precio || !categoria || !descripcion || !cantidad) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const productData = { nombre, precio, categoria, descripcion, cantidad };

    const url = id ? `http://localhost:3000/inventario/${id}` : 'http://localhost:3000/inventario';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            loadInventory();
            closeModal(); 
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Error al guardar el producto en inventario');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al guardar el producto en inventario');
    }
});

function resetForm() {
    document.getElementById('formTitle').textContent = 'Agregar Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

async function editProduct(id) {
    try {
        const response = await fetch(`http://localhost:3000/inventario/${id}`);
        const product = await response.json();

        if (product && product.id) {
            document.getElementById('formTitle').textContent = 'Editar Producto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.nombre_producto;
            document.getElementById('productPrice').value = product.precio;
            document.getElementById('productCategory').value = product.categoria;
            document.getElementById('productDescription').value = product.descripcion;
            document.getElementById('productQuantity').value = product.cantidad;

            openModal();
        } else {
            alert('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        alert('Error al obtener los detalles del producto');
    }
}

async function deleteProduct(id) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:3000/inventario/${id}`, { method: 'DELETE' });

            if (response.ok) {
                loadInventory();
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message || 'Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Hubo un problema al eliminar el producto');
        }
    }
}
