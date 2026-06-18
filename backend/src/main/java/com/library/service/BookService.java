package com.library.service;

import com.library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {
    Page<Book> getAllBooks(Pageable pageable);
    Page<Book> searchBooks(String query, Pageable pageable);
    Book addBook(Book book);
    void deleteBook(Long id);
    Book getBookById(Long id);
    Book updateBook(Long id, Book book);
}
