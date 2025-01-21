// Plik dla kontrolerów produktów

import {productSchema} from '../models/Product.js';
import {Op} from 'sequelize';

// Pobieranie wszystkich produktów
const getProducts = async (req, res) => {
    try {
        const products = await productSchema.findAll();
        res.status(200).json({ products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania produktów" });
    }
};


// Pobieranie pojedynczego produktu
const getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        // Pobieranie produktu po id
        const product = await productSchema.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Produkt nie został znaleziony" });
        }

        res.status(200).json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania produktu" });
    }
};


// Dodawanie nowego produktu (dla admina)
const addProduct = async (req, res) => {
    const { title, price, description, category, image, availableQuantity } = req.body;

    try {
        // Tworzenie nowego produktu
        const newProduct = await productSchema.create({
            title,
            price,
            description,
            category,
            image,
            availableQuantity
        });

        res.status(201).json({ newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas dodawania produktu" });
    }
};


// Aktualizacja produktu (dla admina)
const updateProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        // Pobieranie produktu
        const product = await productSchema.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Produkt nie został znaleziony" });
        }

        // Aktualizacja produktu
        await product.update(req.body);

        res.status(200).json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas aktualizacji produktu" });
    }
};


// Usuwanie produktu (dla admina)
const deleteProduct = async (req, res) => {
    const  productid = req.params.id;

    try {
        // Znalezienie produktu do usunięcia
        const product = await productSchema.findByPk(productid);
        if (!product) {
            return res.status(404).json({ message: "Produkt nie został znaleziony" });
        }

        // Usunięcie produktu
        await product.destroy();

        res.status(200).json({ message: "Produkt został usunięty" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas usuwania produktu" });
    }
};


// Filtrowanie produktów według kilku filtrów
const getFilteredProducts = async(req, res) => {
    const {category, minPrice, maxPrice, sort} = req.query;

    // Budowanie filtrów
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price[Op.gte] = Number(minPrice);
        if (maxPrice) filter.price[Op.lte] = Number(maxPrice);
    }

    // Sortowanie produktów
    const sortOptions = [];
    if (sort === 'priceAsc') sortOptions.push(['price', 'ASC']);
    if (sort === 'priceDesc') sortOptions.push(['price', 'DESC']);

    try {
        const products = await productSchema.findAll({
            where: filter,
            order: sortOptions
        });

        res.status(200).json({ products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania produktów" });
    }
};


// Pobieranie wszystkich dostępnych kategorii
const getCategories = async(req, res) => {
    try {
        const categories = await productSchema.findAll({
            attributes: ['category'],
            group: ['category']
        });
        
        const categoryList = categories.map(cat => cat.category);
        res.status(200).json({ categories: categoryList });
    } catch (err) {
        console.error("Błąd pobierania kategorii:", err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania kategorii" });
    }
};

export { getProducts, getProductById, addProduct, updateProduct, deleteProduct, getFilteredProducts, getCategories };