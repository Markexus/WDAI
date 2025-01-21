import { reviewSchema } from '../models/Review.js';
import { productSchema } from '../models/Product.js';
import { userSchema } from '../models/User.js';

const addReview = async (req, res) => {
    const { productid } = req.params;
    const { rating, comment } = req.body;

    // Poprawne pobranie userId z req.user
    const userid = req.user?.userId;

    if (!userid) {
        return res.status(401).json({ message: 'Brak autoryzacji użytkownika' });
    }

    if (!productid || !comment || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Niepoprawne dane recenzji' });
    }

    try {
        const product = await productSchema.findByPk(productid);
        if (!product) {
            return res.status(404).json({ message: 'Produkt nie istnieje' });
        }

        const existingReview = await reviewSchema.findOne({
            where: { productId: productid, userId: userid },
        });

        if (existingReview) {
            return res.status(400).json({ message: 'Już dodałeś recenzję do tego produktu' });
        }

        const review = await reviewSchema.create({
            productId: productid,
            userId: userid,
            rating: Number(rating),
            comment,
        });

        // Zaktualizuj średnią ocenę produktu
        const reviews = await reviewSchema.findAll({ where: { productId: review.productId } });
        const averageRating = reviews.length
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
            : 0;

        product.rating = averageRating;
        await product.save();

        res.status(201).json({ message: 'Recenzja została dodana' });
    } catch (error) {
        console.error("Błąd podczas dodawania recenzji:", error);
        res.status(500).json({ message: 'Nie udało się dodać recenzji' });
    }
};

const getReviewsByProduct = async (req, res) => {
    const { productid } = req.params;

    try {
        const reviews = await reviewSchema.findAll({
            where: { productId: productid },
            include: {
                model: userSchema,
                attributes: ['name'],
            },
        });

        res.status(200).json({ reviews });
    } catch (err) {
        console.error("Błąd serwera przy pobieraniu opinii:", err);
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
};
const deleteReview = async (req, res) => {
    const { reviewid } = req.params;
    const userid = req.user?.userId;
    const userRole = req.user?.role;

    try {
        // Znajdź recenzję
        const review = await reviewSchema.findByPk(reviewid);

        if (!review) {
            return res.status(404).json({ message: 'Recenzja nie istnieje' });
        }

        // Sprawdź, czy użytkownik jest właścicielem recenzji lub adminem
        if (review.userId !== userid && userRole !== 'admin') {
            return res.status(403).json({ message: 'Brak autoryzacji do usunięcia recenzji' });
        }

        // Usuń recenzję
        await review.destroy();

        // Zaktualizuj średnią ocenę produktu
        const reviews = await reviewSchema.findAll({ where: { productId: review.productId } });
        const averageRating = reviews.length
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
            : 0;

        const product = await productSchema.findByPk(review.productId);
        product.rating = averageRating;
        await product.save();

        res.status(200).json({ message: 'Recenzja została usunięta' });
    } catch (error) {
        console.error("Błąd podczas usuwania recenzji:", error);
        res.status(500).json({ message: 'Nie udało się usunąć recenzji' });
    }
};

export { addReview, getReviewsByProduct, deleteReview };
