package com.library.service.impl;

import com.library.dto.FineResponse;
import com.library.entity.BookIssue;
import com.library.entity.Fine;
import com.library.entity.User;
import com.library.exception.BusinessLogicException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.FineRepository;
import com.library.repository.UserRepository;
import com.library.service.FineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final UserRepository userRepository;
    
    // $1.00 per day fine
    private static final BigDecimal DAILY_FINE_RATE = new BigDecimal("1.00");

    public FineServiceImpl(FineRepository fineRepository, UserRepository userRepository) {
        this.fineRepository = fineRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void calculateAndCreateFine(BookIssue bookIssue) {
        if (bookIssue.getReturnDate() != null && bookIssue.getReturnDate().isAfter(bookIssue.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(bookIssue.getDueDate(), bookIssue.getReturnDate());
            if (daysOverdue > 0) {
                BigDecimal amount = DAILY_FINE_RATE.multiply(BigDecimal.valueOf(daysOverdue));
                
                Fine fine = Fine.builder()
                        .user(bookIssue.getUser())
                        .bookIssue(bookIssue)
                        .amount(amount)
                        .reason(daysOverdue + " days overdue")
                        .status(Fine.FineStatus.UNPAID)
                        .build();
                        
                fineRepository.save(fine);
            }
        }
    }

    @Override
    @Transactional
    public FineResponse payFine(Long fineId, Long userId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found"));

        if (!fine.getUser().getId().equals(userId)) {
            throw new BusinessLogicException("You can only pay your own fines");
        }

        if (fine.getStatus() == Fine.FineStatus.PAID) {
            throw new BusinessLogicException("This fine is already paid");
        }

        fine.setStatus(Fine.FineStatus.PAID);
        fine = fineRepository.save(fine);

        return mapToResponse(fine);
    }

    @Override
    public List<FineResponse> getMyFines(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        return fineRepository.findByUser(user)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<FineResponse> getAllFines() {
        return fineRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private FineResponse mapToResponse(Fine fine) {
        return FineResponse.builder()
                .id(fine.getId())
                .bookTitle(fine.getBookIssue().getBook().getTitle())
                .amount(fine.getAmount())
                .reason(fine.getReason())
                .status(fine.getStatus().name())
                .createdAt(fine.getCreatedAt())
                .build();
    }
}
