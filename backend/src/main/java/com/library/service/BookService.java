package com.library.service;

import com.library.entity.Book;

import java.util.List;

public interface BookService {
    List<Book> getAllBooks();
    List<Book> searchBooks(String query);
    Book addBook(Book book);
    void deleteBook(Long id);
    Book getBookById(Long id);
}
