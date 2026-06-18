package com.library.repository;

import com.library.entity.BookIssue;
import com.library.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {
    List<BookIssue> findByUserAndStatus(User user, BookIssue.IssueStatus status);
    List<BookIssue> findByUser(User user);
    Optional<BookIssue> findByUserIdAndBookIdAndStatus(Long userId, Long bookId, BookIssue.IssueStatus status);
    long countByUserAndStatus(User user, BookIssue.IssueStatus status);
    List<BookIssue> findByStatusAndDueDateBefore(BookIssue.IssueStatus status, LocalDateTime date);
}
