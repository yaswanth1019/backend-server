const express = require('express');
const { getAllBooks, addNewBook, getBookById, updateSingleBook, deleteBook } = require('../controller/bookController');
const bookRouter = express.Router()

bookRouter.get('/get',getAllBooks);
bookRouter.get('/get/:id',getBookById)
bookRouter.post('/add',addNewBook)
bookRouter.put('/update/:id',updateSingleBook)
bookRouter.delete('/delete/:id',deleteBook)

module.exports = bookRouter;