package com.library.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookIssueResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String isbn;
    private LocalDateTime issueDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private String status;
}
