const fs = require('fs');

class Cart {
    constructor() {
        this.id = 0;
        this.products = [];
    }
}

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.loadCarts();
    }

    loadCarts() {
        if (fs.existsSync(this.path)) {
            try {
                this.carts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            } catch (error) {
                console.log('Error reading cart file:', error);
            }
        }
    }

    async saveCarts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
        } catch (error) {
            console.log('Error saving carts:', error);
            throw new Error('Error saving carts');
        }
    }

    async createCart() {
        const newCart = new Cart();
        if (this.carts.length > 0) {
            newCart.id = this.carts[this.carts.length - 1].id + 1;
        } else {
            newCart.id = 1;
        }
    
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({
                product: productId, // Sólo el ID del producto
                quantity: quantity
            });
        }
        await this.saveCarts();
    }
}

module.exports = {
    CartManager: new CartManager("./data/carts.json"),
    Cart
};