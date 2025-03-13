document.addEventListener('DOMContentLoaded', loadProducts);

const productModal = document.getElementById('productModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.querySelector('.close-button');

// Función para mostrar el modal
function openModal() {
    productModal.style.display = 'flex'; // Aseguramos que el modal esté en display flex
}

// Función para ocultar el modal
function closeModal() {
    productModal.style.display = 'none';
    resetForm(); // Limpia el formulario cada vez que se cierra
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

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/menu');
        const data = await response.json();

        const menuBody = document.getElementById('menu-body');
        menuBody.innerHTML = '';

        data.data.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
             
                <td>${product.nombre_producto}</td>
                <td>${product.precio}</td>
                <td>${product.categoria}</td>
                <td>${product.descripcion}</td>
                <td>
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                </td>
            `;
            menuBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos');
    }
}

document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('productId').value;
    const nombre = document.getElementById('productName').value.trim();
    const precio = document.getElementById('productPrice').value.trim();
    const categoria = document.getElementById('productCategory').value.trim();
    const descripcion = document.getElementById('productDescription').value.trim();

    if (!nombre || !precio || !categoria || !descripcion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const productData = { nombre, precio, categoria, descripcion };

    const url = id ? `http://localhost:3000/menu/${id}` : 'http://localhost:3000/menu';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            loadProducts();
            closeModal(); 
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al guardar el producto');
    }
});

function resetForm() {
    document.getElementById('formTitle').textContent = 'Agregar Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

async function editProduct(id) {
    try {
        const response = await fetch(`http://localhost:3000/menu/${id}`);
        const product = await response.json();

        if (product && product.id) {
            document.getElementById('formTitle').textContent = 'Editar Producto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.nombre_producto;
            document.getElementById('productPrice').value = product.precio;
            document.getElementById('productCategory').value = product.categoria;
            document.getElementById('productDescription').value = product.descripcion;

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
            const response = await fetch(`http://localhost:3000/menu/${id}`, { method: 'DELETE' });

            if (response.ok) {
                loadProducts();
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
