const fs = require('fs');

class Product {
    constructor(title, description, price, thumbnail, code, stock, status, category, thumbnails) {
        this.id = 0;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
        this.thumbnails = thumbnails;
    }
}

class ProductManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
        }
    }

    async addProduct(product) {
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock ||
            typeof product.status !== 'boolean' ||
            !product.category ||
            !Array.isArray(product.thumbnails)
        ) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        if (this.products.length > 0) {
            const newId = this.products[this.products.length - 1].id + 1;
            product.id = newId;
        } else {
            product.id = 1;
        }

        this.products.push(product);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            console.log('Se agregó el producto');
        } catch (error) {
            console.log(error);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(idProduct) {
        if (isNaN(Number(idProduct))) {
            console.log('El ID debe ser un número');
            return;
        }

        const product = this.products.find(product => product.id === Number(idProduct));

        if (!product) {
            return 'No se encontró el producto';
        }

        return product;
    }

    async deleteProduct(idProduct) {
        const productIndex = this.products.findIndex(product => product.id === idProduct);
        if (productIndex === -1) {
            console.log('No se encontró el producto');
            return;
        }

        this.products.splice(productIndex, 1);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            console.log('Se eliminó el producto');
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(idProduct, product) {
        const productIndex = this.products.findIndex(prod => prod.id === idProduct);
        if (productIndex === -1) {
            console.log('No se encontró el producto');
            return;
        }
    
        const existingProduct = this.products[productIndex];
        const updatedProduct = { ...existingProduct, ...product, id: existingProduct.id }; // Mantenemos el ID original
        this.products[productIndex] = updatedProduct;
    
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            console.log('Se actualizó el producto');
        } catch (error) {
            console.log(error);
        }
    }}
    

module.exports = {
    ProductManager: new ProductManager("./data/products.json"),
    Product
};

// // Pruebas
// const manager = new ProductManager("./data/products.json");
// // Add Product ✅
// manager.addProduct(
//   new Product("Product 1", "Description 1", 100, "image 1", "0001A", 10)
// );
// manager.addProduct(
//   new Product("Product 2", "Description 2", 200, "image 2", "0002B", 20)
// );
// manager.addProduct(
//   new Product("Product 3", "Description 3", 300, "image 3", "0003C", 30)
// );
// manager.addProduct(
//   new Product("Product 4", "Description 4", 400, "image 4", "0004D", 40)
// );

// // Get Products ✅
// console.log(manager.getProducts());

// // Get Product By Id ✅
// console.log(manager.getProductById(2));

// // Delete Product ✅
// manager.deleteProduct(3);

// // Update Product ✅
// manager.updateProduct(1, {
//   title: "Product 1 Updated",
// });
