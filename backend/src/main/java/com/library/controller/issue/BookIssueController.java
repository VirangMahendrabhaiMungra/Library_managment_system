package com.library.controller.issue;

import com.library.dto.BookIssueResponse;
import com.library.dto.BorrowRequest;
import com.library.entity.User;
import com.library.repository.UserRepository;
import com.library.service.BookIssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class BookIssueController {

    private final BookIssueService bookIssueService;
    private final UserRepository userRepository;

    public BookIssueController(BookIssueService bookIssueService, UserRepository userRepository) {
        this.bookIssueService = bookIssueService;
        this.userRepository = userRepository;
    }

    @PostMapping("/borrow")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<BookIssueResponse> borrowBook(@RequestBody BorrowRequest request, Authentication authentication) {
        User user = getUser(authentication);
        return ResponseEntity.ok(bookIssueService.borrowBook(user.getId(), request.getBookId()));
    }

    @PostMapping("/{id}/return")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<BookIssueResponse> returnBook(@PathVariable Long id, Authentication authentication) {
        User user = getUser(authentication);
        return ResponseEntity.ok(bookIssueService.returnBook(id, user.getId()));
    }

    @GetMapping("/my-books")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<List<BookIssueResponse>> getMyBorrowedBooks(Authentication authentication) {
        User user = getUser(authentication);
        return ResponseEntity.ok(bookIssueService.getMyBorrowedBooks(user.getId()));
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<List<BookIssueResponse>> getMyHistory(Authentication authentication) {
        User user = getUser(authentication);
        return ResponseEntity.ok(bookIssueService.getMyHistory(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<List<BookIssueResponse>> getAllIssues() {
        return ResponseEntity.ok(bookIssueService.getAllIssues());
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
