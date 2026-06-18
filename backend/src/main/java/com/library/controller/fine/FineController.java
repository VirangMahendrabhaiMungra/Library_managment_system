package com.library.controller.fine;

import com.library.dto.FineResponse;
import com.library.entity.User;
import com.library.repository.UserRepository;
import com.library.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins = "*")
public class FineController {

    private final FineService fineService;
    private final UserRepository userRepository;

    public FineController(FineService fineService, UserRepository userRepository) {
        this.fineService = fineService;
        this.userRepository = userRepository;
    }

    @GetMapping("/my-fines")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<List<FineResponse>> getMyFines(Authentication authentication) {
        User user = getUser(authentication);
        return ResponseEntity.ok(fineService.getMyFines(user.getId()));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<FineResponse> payFine(@PathVariable Long id, Authentication authentication) {
        User user = getUser(authentication);
        return ResponseEntity.ok(fineService.payFine(id, user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<List<FineResponse>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
