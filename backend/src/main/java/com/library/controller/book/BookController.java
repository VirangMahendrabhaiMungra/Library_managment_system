package com.library.controller.book;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(bookRepository.findByTitleContainingIgnoreCase(search));
        }
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            return ResponseEntity.badRequest().body("Book with this ISBN already exists.");
        }
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.ok("Book deleted successfully");
    }
}
