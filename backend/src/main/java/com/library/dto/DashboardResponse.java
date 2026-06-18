package com.library.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {
    private long totalBooks;
    private long borrowedBooks;
    private BigDecimal pendingFines;
    private long overdueBooks;
}
