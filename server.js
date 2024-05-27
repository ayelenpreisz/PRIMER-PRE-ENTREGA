const express = require('express');
const fs = require('fs');
const { ProductManager, Product } = require('./ProductManager.js');
const { CartManager } = require('./CartManager.js');

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("<h1>Bienvenido a mi API </h1>");
});

app.get('/products', (req, res) => {
    res.json(ProductManager.getProducts());
});

app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = ProductManager.getProductById(Number(id));
    if (!product) {
        return res.status(404).json({
            error: "No se encontró el producto",
        });
    }
    res.json(product);
});

app.post('/products', (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category, thumbnails } = req.body;
    const newProduct = new Product(
        title, description, price, thumbnail, code, stock, status, category, thumbnails
    );
    ProductManager.addProduct(newProduct)
        .then(() => res.status(201).json(newProduct))
        .catch(error => res.status(500).json({ error: "Error al agregar el producto" }));
});

app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const productUpdates = req.body;
    ProductManager.updateProduct(Number(id), productUpdates)
        .then(() => res.status(200).json({ message: "Producto actualizado" }))
        .catch(error => res.status(500).json({ error: "Error al actualizar el producto" }));
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    ProductManager.deleteProduct(Number(id))
        .then(() => res.status(200).json({ message: "Producto eliminado" }))
        .catch(error => res.status(500).json({ error: "Error al eliminar el producto" }));
});

app.post('/carts', (req, res) => {
    CartManager.createCart()
        .then(cart => res.status(201).json(cart))
        .catch(error => res.status(500).json({ error: "Error al crear el carrito" }));
});

app.get('/carts/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = CartManager.getCartById(Number(cid));
    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
});

app.post('/carts/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    CartManager.addProductToCart(Number(cid), Number(pid), 1)
        .then(() => res.status(200).json({ message: "Producto agregado al carrito" }))
        .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});