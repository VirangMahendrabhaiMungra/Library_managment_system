package com.library.service;

import com.library.dto.BookIssueResponse;

import java.util.List;

public interface BookIssueService {
    BookIssueResponse borrowBook(Long userId, Long bookId);
    BookIssueResponse returnBook(Long issueId, Long userId);
    List<BookIssueResponse> getMyBorrowedBooks(Long userId);
    List<BookIssueResponse> getMyHistory(Long userId);
    List<BookIssueResponse> getAllIssues();
}
