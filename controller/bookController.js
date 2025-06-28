const Book = require("../models/Book")

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        if (!books || books.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No books found.'
            });
        }
        return res.json({ books });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId) {
            return res.status(400).json({
                error: true,
                message: 'Book ID is required.'
            });
        }
        const bookFind = await Book.findById(bookId);
        if (!bookFind) {
            return res.status(404).json({
                error: true,
                message: 'Book not found.'
            });
        }
        return res.status(200).json({
            success: true,
            book: bookFind,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }

}

const addNewBook = async (req, res) => {
    try {
        const { title, author, year } = req.body;
        if (!title || !author || !year) {
            return res.status(400).json({
                error: true,
                message: 'Title, author, and year are required.'
            });
        }
        const newBook = await Book({
            title: title,
            author: author,
            year: year
        })

        await newBook.save()
        if (newBook) {
            return res.status(200).json({
                success: true,
                message: 'Book added successfully'
            })
        }
    } catch (error) {
        return res.json({
            error: true,
            message: error.message || error
        })
    }
}

const updateSingleBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, year } = req.body;
        if (!title && !author && !year) {
            return res.status(400).json({
                error: true,
                message: 'At least one field (title, author, or year) is required to update.'
            });
        }
        const updateFields = {};
        if (title) updateFields.title = title;
        if (author) updateFields.author = author;
        if (year) updateFields.year = year;
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            updateFields,
            { new: true }
        );
        if (updatedBook) {
            return res.status(200).json({
                success: true,
                message: 'Book updated successfully',
                book: updatedBook
            });
        } else {
            return res.status(404).json({
                error: true,
                message: 'Book not found'
            });
        }
    } catch (error) {
        return res.json({
            error: true,
            message: error.message || error
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId) {
            return res.status(400).json({
                error: true,
                message: 'Book ID is required.'
            });
        }
        const deletebook = await Book.findByIdAndDelete(bookId);
        if (!deletebook) {
            return res.status(404).json({
                error: true,
                message: 'Book not found.'
            });
        }
        return res.json({
            message: `Book with id ${bookId} is deleted successfully`,
            success: true
        })
    } catch (error) {
        return res.json({
            error: true,
            message: error.message || error
        });
    }
}

module.exports = { getAllBooks, addNewBook, getBookById, updateSingleBook , deleteBook};