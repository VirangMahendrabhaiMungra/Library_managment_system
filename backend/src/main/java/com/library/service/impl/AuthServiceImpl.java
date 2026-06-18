package com.library.service.impl;

import com.library.dto.AuthRequest;
import com.library.dto.AuthResponse;
import com.library.dto.RegisterRequest;
import com.library.entity.User;
import com.library.repository.UserRepository;
import com.library.security.jwt.JwtUtil;
import com.library.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.library.entity.Role;
import com.library.repository.RoleRepository;
import com.library.exception.ResourceNotFoundException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, 
                           JwtUtil jwtUtil, AuthenticationManager authenticationManager,
                           UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String jwtToken = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return AuthResponse.builder()
                .token(jwtToken)
                .username(request.getUsername())
                .role(user.getRole().getName())
                .message("Successfully authenticated")
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }

        Role role;
        if (request.getRoleId() != null) {
            role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));
        } else {
            role = roleRepository.findByName("ROLE_STUDENT")
                    .orElseThrow(() -> new ResourceNotFoundException("Default student role not found"));
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(request.getUsername())
                .role(role.getName())
                .message("Successfully registered")
                .build();
    }
}
