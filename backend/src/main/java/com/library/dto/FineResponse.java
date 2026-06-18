package com.library.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class FineResponse {
    private Long id;
    private String bookTitle;
    private BigDecimal amount;
    private String reason;
    private String status;
    private LocalDateTime createdAt;
}
