package com.library.service.impl;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import com.library.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    @Override
    public Page<Book> searchBooks(String query, Pageable pageable) {
        return bookRepository.findByTitleContainingIgnoreCaseOrIsbnContaining(query, query, pageable);
    }

    @Override
    public Book addBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new RuntimeException("Book with ISBN " + book.getIsbn() + " already exists");
        }
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    @Override
    public Book updateBook(Long id, Book book) {
        Book existingBook = getBookById(id);
        existingBook.setTitle(book.getTitle());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setPublisherId(book.getPublisherId());
        existingBook.setPublishedYear(book.getPublishedYear());
        existingBook.setCategoryId(book.getCategoryId());
        existingBook.setTotalCopies(book.getTotalCopies());
        existingBook.setAvailableCopies(book.getAvailableCopies());
        existingBook.setDescription(book.getDescription());
        return bookRepository.save(existingBook);
    }
}
