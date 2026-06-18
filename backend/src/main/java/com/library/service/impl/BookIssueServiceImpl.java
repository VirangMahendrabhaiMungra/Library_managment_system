package com.library.service.impl;

import com.library.dto.BookIssueResponse;
import com.library.entity.Book;
import com.library.entity.BookIssue;
import com.library.entity.User;
import com.library.exception.BusinessLogicException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookIssueRepository;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import com.library.service.BookIssueService;
import com.library.service.FineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookIssueServiceImpl implements BookIssueService {

    private final BookIssueRepository bookIssueRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final FineService fineService;

    public BookIssueServiceImpl(BookIssueRepository bookIssueRepository, BookRepository bookRepository, UserRepository userRepository, FineService fineService) {
        this.bookIssueRepository = bookIssueRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.fineService = fineService;
    }

    @Override
    @Transactional
    public BookIssueResponse borrowBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new BusinessLogicException("No copies available for this book");
        }

        long activeIssuesCount = bookIssueRepository.countByUserAndStatus(user, BookIssue.IssueStatus.ISSUED);
        if (activeIssuesCount >= 3) {
            throw new BusinessLogicException("You have reached the maximum limit of 3 borrowed books");
        }

        bookIssueRepository.findByUserIdAndBookIdAndStatus(userId, bookId, BookIssue.IssueStatus.ISSUED)
                .ifPresent(issue -> {
                    throw new BusinessLogicException("You have already borrowed this book");
                });

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BookIssue bookIssue = BookIssue.builder()
                .user(user)
                .book(book)
                .dueDate(LocalDateTime.now().plusDays(14))
                .status(BookIssue.IssueStatus.ISSUED)
                .build();

        bookIssue = bookIssueRepository.save(bookIssue);

        return mapToResponse(bookIssue);
    }

    @Override
    @Transactional
    public BookIssueResponse returnBook(Long issueId, Long userId) {
        BookIssue bookIssue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Book issue record not found"));

        if (!bookIssue.getUser().getId().equals(userId)) {
            // Note: In a real app an Admin might return on behalf of a user, but we enforce ownership here for simplicity
            throw new BusinessLogicException("You can only return books you borrowed");
        }

        if (bookIssue.getStatus() != BookIssue.IssueStatus.ISSUED && bookIssue.getStatus() != BookIssue.IssueStatus.OVERDUE) {
            throw new BusinessLogicException("This book has already been returned or is not currently issued");
        }

        bookIssue.setReturnDate(LocalDateTime.now());
        bookIssue.setStatus(BookIssue.IssueStatus.RETURNED);

        Book book = bookIssue.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        bookIssue = bookIssueRepository.save(bookIssue);
        
        fineService.calculateAndCreateFine(bookIssue);

        return mapToResponse(bookIssue);
    }

    @Override
    public List<BookIssueResponse> getMyBorrowedBooks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookIssueRepository.findByUserAndStatus(user, BookIssue.IssueStatus.ISSUED)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<BookIssueResponse> getMyHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookIssueRepository.findByUser(user)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<BookIssueResponse> getAllIssues() {
        return bookIssueRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private BookIssueResponse mapToResponse(BookIssue issue) {
        return BookIssueResponse.builder()
                .id(issue.getId())
                .bookId(issue.getBook().getId())
                .bookTitle(issue.getBook().getTitle())
                .isbn(issue.getBook().getIsbn())
                .issueDate(issue.getIssueDate())
                .dueDate(issue.getDueDate())
                .returnDate(issue.getReturnDate())
                .status(issue.getStatus().name())
                .build();
    }
}
