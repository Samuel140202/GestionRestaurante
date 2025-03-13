// Importar las dependencias necesarias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Crear una instancia de la aplicación Express
const app = express();
const port = 3000; // Puerto en el que el servidor escuchará

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '1234', // Cambia esto por tu contraseña de MySQL
    database: 'copia' // Cambia esto por el nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para manejar el inicio de sesión de administradores
app.post('/login', (req, res) => {
    const { identifier, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND password = ?', [identifier, identifier, password], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Credenciales incorrectas' });
        }
    });
});

//inicio de seccion

// Ruta para manejar el inicio de sesión de empleados
app.post('/login_employee', (req, res) => {
    const { identifier, password } = req.body;

    db.query('SELECT * FROM empleados WHERE (usuario = ? OR email = ?) AND password = ?', [identifier, identifier, password], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para manejar el inicio de sesión de clientes
app.post('/login_client', (req, res) => {
    const { identifier, password } = req.body;

    db.query('SELECT * FROM clientes WHERE (usuario = ? OR email = ?) AND password = ?', [identifier, identifier, password], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para manejar el registro de clientes
app.post('/register_client', (req, res) => {
    const { nombre, apellido, usuario, email, password } = req.body;

    // Consulta para insertar un nuevo cliente
    const query = 'INSERT INTO clientes (nombre, apellido, usuario, email, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido, usuario, email, password], (error, results) => {
        if (error) {
            console.error('Error en la inserción:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.json({ success: false, message: 'El usuario o correo ya está registrado.' });
            }
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
        res.json({ success: true, message: 'Cliente registrado exitosamente' });
    });
});


// final del codigo para inicio de seccion





// Ruta para obtener los productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener productos' });
        }
        res.json({ success: true, data: results });
    });
});

// Nueva ruta para obtener los productos del menú
app.get('/menu', (req, res) => {
    db.query('SELECT * FROM menu', (error, results) => {
        if (error) {
            console.error('Error al obtener el menú:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el menú' });
        }
        res.json({ success: true, data: results });
    });
});

// Ruta para agregar un nuevo producto al menú
app.post('/menu', (req, res) => {
    const { nombre, precio, categoria, descripcion } = req.body;

    const query = 'INSERT INTO menu (nombre_producto, precio, categoria, descripcion) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, precio, categoria, descripcion], (error, results) => {
        if (error) {
            console.error('Error al agregar producto:', error);
            return res.status(500).json({ success: false, message: 'Error al agregar el producto' });
        }
        res.json({ success: true, message: 'Producto agregado exitosamente' });
    });
});

// Ruta para manejar las peticiones GET para obtener un producto específico
app.get('/menu/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM menu WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el producto:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el producto' });
        }
        if (results.length > 0) {
            res.json(results[0]); // Devolvemos el primer resultado (el producto)
        } else {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    });
});

// Ruta para manejar la actualización de un producto
app.put('/menu/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria, descripcion } = req.body;

    const query = 'UPDATE menu SET nombre_producto = ?, precio = ?, categoria = ?, descripcion = ? WHERE id = ?';
    db.query(query, [nombre, precio, categoria, descripcion, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el producto:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
        }
        res.json({ success: true, message: 'Producto actualizado exitosamente' });
    });
});


// Ruta para eliminar un producto del menú
app.delete('/menu/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM menu WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
        }
        res.json({ success: true, message: 'Producto eliminado exitosamente' });
    });
});


// inventario

// Ruta para obtener los productos del inventario
app.get('/inventario', (req, res) => { // Ahora usa /inventario
    db.query('SELECT * FROM inventario', (error, results) => {
        if (error) {
            console.error('Error al obtener el inventario:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el inventario' });
        }
        res.json({ success: true, data: results });
    });
});



// Ruta para agregar un nuevo producto al inventario
app.post('/inventario', (req, res) => {
    const { nombre, precio, categoria, descripcion, cantidad } = req.body;

    const query = 'INSERT INTO inventario (nombre_producto, precio, categoria, descripcion, cantidad) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, precio, categoria, descripcion, cantidad], (error, results) => {
        if (error) {
            console.error('Error al agregar producto al inventario:', error);
            return res.status(500).json({ success: false, message: 'Error al agregar el producto' });
        }
        res.json({ success: true, message: 'Producto agregado exitosamente al inventario' });
    });
});


// Nueva ruta para obtener los productos del inventario
app.get('/inventario', (req, res) => {
    db.query('SELECT * FROM inventario', (error, results) => {
        if (error) {
            console.error('Error al obtener el inventario:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el inventario' });
        }
        res.json({ success: true, data: results });
    });
});



// Ruta para manejar las peticiones GET para obtener un producto específico del inventario
app.get('/inventario/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM inventario WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el producto del inventario:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el producto' });
        }
        if (results.length > 0) {
            res.json(results[0]); // Devolvemos el primer resultado (el producto)
        } else {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
    });
});

// Ruta para manejar la actualización de un producto en el inventario
app.put('/inventario/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria, descripcion, cantidad } = req.body;

    const query = 'UPDATE inventario SET nombre_producto = ?, precio = ?, categoria = ?, descripcion = ?, cantidad = ? WHERE id = ?';
    db.query(query, [nombre, precio, categoria, descripcion, cantidad, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el producto del inventario:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
        }
        res.json({ success: true, message: 'Producto actualizado exitosamente en el inventario' });
    });
});

// Ruta para eliminar un producto del inventario
app.delete('/inventario/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM inventario WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar producto del inventario:', error);
            return res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
        }
        res.json({ success: true, message: 'Producto eliminado exitosamente del inventario' });
    });
});



//para empleados
// Ruta para obtener todos los empleados
app.get('/empleados', (req, res) => {
    db.query('SELECT id, nombre, apellido, email, usuario, password FROM empleados', (error, results) => {
        if (error) {
            console.error('Error al obtener los empleados:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener los empleados' });
        }
        res.json({ success: true, data: results });
    });
});

// Ruta para obtener un empleado específico por ID
app.get('/empleados/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT id, nombre, apellido, email, usuario, password FROM empleados WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el empleado:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el empleado' });
        }
        if (results.length > 0) {
            res.json({ success: true, data: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Empleado no encontrado' });
        }
    });
});

// Ruta para agregar un nuevo empleado
app.post('/empleados', (req, res) => {
    const { nombre, apellido, email, usuario, password } = req.body;

    const query = 'INSERT INTO empleados (nombre, apellido, email, usuario, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido, email, usuario, password], (error, results) => {
        if (error) {
            console.error('Error al agregar el empleado:', error);
            return res.status(500).json({ success: false, message: 'Error al agregar el empleado' });
        }
        res.json({ success: true, message: 'Empleado agregado exitosamente' });
    });
});

// Ruta para actualizar un empleado existente
app.put('/empleados/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, usuario, password } = req.body;

    const query = 'UPDATE empleados SET nombre = ?, apellido = ?, email = ?, usuario = ?, password = ? WHERE id = ?';
    db.query(query, [nombre, apellido, email, usuario, password, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el empleado:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el empleado' });
        }
        res.json({ success: true, message: 'Empleado actualizado exitosamente' });
    });
});

// Ruta para eliminar un empleado por ID
app.delete('/empleados/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM empleados WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el empleado:', error);
            return res.status(500).json({ success: false, message: 'Error al eliminar el empleado' });
        }
        res.json({ success: true, message: 'Empleado eliminado exitosamente' });
    });
});


// Ruta para obtener todos los clientes
app.get('/clientes', (req, res) => {
    db.query('SELECT id_clientes, nombre, apellido, email, usuario, password FROM clientes', (error, results) => {
        if (error) {
            console.error('Error al obtener los clientes:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener los clientes' });
        }
        res.json({ success: true, data: results });
    });
});

// Ruta para obtener un cliente específico por ID
app.get('/clientes/:id_clientes', (req, res) => {
    const { id_clientes } = req.params;
    db.query('SELECT id_clientes, nombre, apellido, email, usuario, password FROM clientes WHERE id_clientes = ?', [id_clientes], (error, results) => {
        if (error) {
            console.error('Error al obtener el cliente:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el cliente' });
        }
        if (results.length > 0) {
            res.json({ success: true, data: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
    });
});

// Ruta para agregar un nuevo cliente
app.post('/clientes', (req, res) => {
    const { nombre, apellido, email, usuario, password } = req.body;

    const query = 'INSERT INTO clientes (nombre, apellido, email, usuario, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido, email, usuario, password], (error, results) => {
        if (error) {
            console.error('Error al agregar el cliente:', error);
            return res.status(500).json({ success: false, message: 'Error al agregar el cliente' });
        }
        res.json({ success: true, message: 'Cliente agregado exitosamente', id_clientes: results.insertId });
    });
});

// Ruta para actualizar un cliente existente
app.put('/clientes/:id_clientes', (req, res) => {
    const { id_clientes } = req.params;
    const { nombre, apellido, email, usuario, password } = req.body;

    const query = 'UPDATE clientes SET nombre = ?, apellido = ?, email = ?, usuario = ?, password = ? WHERE id_clientes = ?';
    db.query(query, [nombre, apellido, email, usuario, password, id_clientes], (error, results) => {
        if (error) {
            console.error('Error al actualizar el cliente:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el cliente' });
        }
        res.json({ success: true, message: 'Cliente actualizado exitosamente' });
    });
});

// Ruta para eliminar un cliente por ID
app.delete('/clientes/:id_clientes', (req, res) => {
    const { id_clientes } = req.params;

    const query = 'DELETE FROM clientes WHERE id_clientes = ?';
    db.query(query, [id_clientes], (error, results) => {
        if (error) {
            console.error('Error al eliminar el cliente:', error);
            return res.status(500).json({ success: false, message: 'Error al eliminar el cliente' });
        }
        res.json({ success: true, message: 'Cliente eliminado exitosamente' });
    });
});



//pedidos///////////////////////////////////////////////////////////////////////////////////////


// Ruta para obtener los productos del inventario
app.get('/inventario', (req, res) => {
    db.query('SELECT * FROM inventario', (error, results) => {
        if (error) {
            console.error('Error al obtener el inventario:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el inventario' });
        }
        res.json({ success: true, data: results });
    });
});

// Ruta para agregar un nuevo pedido
app.post('/pedidos', (req, res) => {
    const { cliente_id, productos, total } = req.body;

    // Verificar que los campos necesarios estén presentes
    if (!cliente_id || !productos || !total) {
        return res.status(400).json({ success: false, message: 'Faltan datos para crear el pedido' });
    }

     // Verificar que no haya más de 10 productos
     if (productos.length > 10) {
        return res.status(400).json({ success: false, message: 'No se pueden agregar más de 10 productos por pedido' });
    }

    // Crear la cadena de productos sin corchetes ni paréntesis
    const productosStr = productos.map(product => {
        return `${product.nombre_producto} x ${product.cantidad}`;  // Solo nombre y cantidad
    }).join(', ');  // Une los productos con coma

    // Iniciar una transacción para actualizar el inventario y agregar el pedido
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al iniciar transacción' });
        }

        // Insertar el pedido en la tabla 'pedidos'
        const queryPedido = 'INSERT INTO pedidos (cliente_id, productos, total) VALUES (?, ?, ?)';
        db.query(queryPedido, [cliente_id, productosStr, total], (error, results) => {
            if (error) {
                return db.rollback(() => {
                    console.error('Error al agregar el pedido:', error);
                    return res.status(500).json({ success: false, message: 'Error al agregar el pedido' });
                });
            }

            // Obtener el ID del pedido recién insertado
            const pedidoId = results.insertId;

            // Restar la cantidad de cada producto del inventario
            const updateInventarioQueries = productos.map(product => {
                return new Promise((resolve, reject) => {
                    // Actualizar la cantidad en el inventario
                    const queryInventario = 'UPDATE inventario SET cantidad = cantidad - ? WHERE nombre_producto = ? AND cantidad >= ?';
                    db.query(queryInventario, [product.cantidad, product.nombre_producto, product.cantidad], (error, results) => {
                        if (error) {
                            return reject('Error al actualizar inventario');
                        }

                        if (results.affectedRows === 0) {
                            return reject('No hay suficiente stock para el producto ' + product.nombre_producto);
                        }

                        resolve();
                    });
                });
            });

            // Ejecutar todas las actualizaciones del inventario
            Promise.all(updateInventarioQueries)
                .then(() => {
                    // Confirmar la transacción si todas las actualizaciones son exitosas
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error al confirmar la transacción:', err);
                                return res.status(500).json({ success: false, message: 'Error al confirmar la transacción' });
                            });
                        }

                        res.json({ success: true, message: 'Pedido agregado exitosamente y inventario actualizado' });
                    });
                })
                .catch((error) => {
                    // Si hay un error al actualizar el inventario, revertir la transacción
                    db.rollback(() => {
                        console.error('Error al actualizar inventario:', error);
                        res.status(500).json({ success: false, message: error });
                    });
                });
        });
    });
});

// Ruta para eliminar un pedido por ID
app.delete('/pedidos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM pedidos WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el pedido:', error);
            return res.status(500).json({ success: false, message: 'Error al eliminar el pedido' });
        }
        res.json({ success: true, message: 'Pedido eliminado exitosamente' });
    });
});





//para ver pedido
// Ruta para obtener todos los pedidos
app.get('/pedidos', (req, res) => {
    db.query('SELECT * FROM pedidos', (error, results) => {
        if (error) {
            console.error('Error al obtener los pedidos:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener los pedidos' });
        }
        res.json({ success: true, data: results });
    });
});

// Ruta para obtener un pedido específico
app.get('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM pedidos WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el pedido:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener el pedido' });
        }
        if (results.length > 0) {
            res.json({ success: true, data: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Pedido no encontrado' });
        }
    });
});








// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
