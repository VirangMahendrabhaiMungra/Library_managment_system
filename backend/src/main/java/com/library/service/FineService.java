package com.library.service;

import com.library.dto.FineResponse;
import com.library.entity.BookIssue;

import java.util.List;

public interface FineService {
    void calculateAndCreateFine(BookIssue bookIssue);
    FineResponse payFine(Long fineId, Long userId);
    List<FineResponse> getMyFines(Long userId);
    List<FineResponse> getAllFines();
}
