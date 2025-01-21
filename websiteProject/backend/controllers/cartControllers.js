// Plik do obsługi kontrolerów koszyka

import {cartSchema, cartItemSchema} from '../models/Cart.js';
import {productSchema} from '../models/Product.js';

// Funkcja do dodawania produktu do koszyka
const addToCart = async(req, res) => {
    const { productId, quantity } = req.body;
    const userid = req.user.userId;

    try {
        // Sprawdzenie czy produkt istnieje
        const product = await productSchema.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produkt nie został znaleziony' });
        }

        // Sprawdzenie czy produkt jest dostępny
        if (product.availableQuantity < quantity) {
            return res.status(400).json({ message: 'Produkt nie jest dostępny w takiej ilości' });
        }

        // Sprawdzenie czy koszyk już istnieje
        let cart = await cartSchema.findOne({where: { user: userid }});
        if (!cart) {
            cart = await cartSchema.create({ user: userid });
        }

        // Sprawdzenie czy produkt jest już w koszyku
        const cartItem = await cartItemSchema.findOne({where: { cartId: cart.id, productId }});

        if (cartItem) {
            // Aktualizujemy ilość
            cartItem.quantity = quantity;
            await cartItem.save();
        } else {
            // Dodajemy nowy produkt do koszyka
            await cartItemSchema.create({ productId, quantity, cartId: cart.id });
        }

        res.status(200).json({ message: 'Produkt został dodany do koszyka', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
};


// Funkcja do usuwania produktu z koszyka
const removeFromCart = async(req, res) => {
    const { productId } = req.params;
    const userid = req.user.userId;

    try {
        // Pobieranie koszyka użytkownika
        let cart = await cartSchema.findOne({where: { user: userid }});
        if (!cart) {
            return res.status(404).json({ message: 'Koszyk nie został znaleziony' });
        }

        // Sprawdzenie czy produkt jest w koszyku
        const cartItem = await cartItemSchema.findOne({ where: { cartId: cart.id, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Produkt nie został znaleziony w koszyku' });
        }

        // Usunięcie produktu z koszyka
        await cartItem.destroy();

        res.status(200).json({ message: 'Produkt został usunięty z koszyka', cart });
    } catch (error) {
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
};


// Funkcja do pobierania koszyka
const getCart = async(req, res) => {
    const userid = req.user.userId;

    try {
        // Pobieranie koszyka użytkownika
        let cart = await cartSchema.findOne({
            where: { user: userid },
            include: {
                model: cartItemSchema, 
                as: "cartItems", 
                include: {
                    model: productSchema, 
                    as: "product", 
                    attributes: ['id', 'title', 'price', 'availableQuantity', 'image']
                }
            }
        });
        if (!cart) {
            return res.status(404).json({ message: 'Koszyk nie został znaleziony' });
        }

        // Jeżeli koszyk jest pusty (nie zawiera produktów), zwróć informację o pustym koszyku
        if (cart.cartItems.length === 0) {
            return res.status(200).json({ message: 'Koszyk jest pusty.' });
        }

        res.status(200).json({cart});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
};

export { addToCart, removeFromCart, getCart };