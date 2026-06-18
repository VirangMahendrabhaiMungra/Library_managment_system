package com.library.controller.dashboard;

import com.library.dto.DashboardResponse;
import com.library.entity.BookIssue;
import com.library.entity.Fine;
import com.library.entity.User;
import com.library.repository.BookIssueRepository;
import com.library.repository.BookRepository;
import com.library.repository.FineRepository;
import com.library.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final BookRepository bookRepository;
    private final BookIssueRepository bookIssueRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;

    public DashboardController(BookRepository bookRepository, BookIssueRepository bookIssueRepository, 
                               FineRepository fineRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.bookIssueRepository = bookIssueRepository;
        this.fineRepository = fineRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardResponse> getStats(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalBooks = bookRepository.count();
        long borrowedBooks = bookIssueRepository.countByUserAndStatus(user, BookIssue.IssueStatus.ISSUED);
        
        List<Fine> unpaidFines = fineRepository.findByUserAndStatus(user, Fine.FineStatus.UNPAID);
        BigDecimal pendingFinesAmount = unpaidFines.stream()
                .map(Fine::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate overdue books for the user
        List<BookIssue> activeIssues = bookIssueRepository.findByUserAndStatus(user, BookIssue.IssueStatus.ISSUED);
        long overdueBooks = activeIssues.stream()
                .filter(issue -> issue.getDueDate().isBefore(LocalDateTime.now()))
                .count();

        DashboardResponse response = DashboardResponse.builder()
                .totalBooks(totalBooks)
                .borrowedBooks(borrowedBooks)
                .pendingFines(pendingFinesAmount)
                .overdueBooks(overdueBooks)
                .build();

        return ResponseEntity.ok(response);
    }
}
