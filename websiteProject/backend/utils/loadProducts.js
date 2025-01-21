// Skrypt do pobierania produktów z API i zapisanie go w naszej bazie

import { productSchema } from '../models/Product.js';
import axios from 'axios';

// Funkcja do pobierania danych i zapisania
const fetchAndSaveProducts = async () => {
  try {
    // Pobieranie danych z API
    const response = await axios.get('https://fakestoreapi.com/products');
    
    // Zamiana z JSON na tablicę obiektó JS
    const products = response.data;

    // Iteracja po produktach i zapis w bazie danych
    for (const product of products) {
        const { title, price, description, category, image } = product;

        const newProduct = new productSchema({
          title,
          price,
          description,
          category,
          image
      });

        // Zapis danych w bazie
        await newProduct.save();
    }

    console.log('Produkty zostały pomyślnie załadowane do bazy danych!');
  }  catch (err) {
    console.error('Błąd podczas pobierania danych z API:', err);
  }
};

export {fetchAndSaveProducts};