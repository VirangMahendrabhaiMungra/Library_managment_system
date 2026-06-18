package com.library.config;

import com.library.entity.Role;
import com.library.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner loadRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                Role admin = Role.builder().name("ROLE_ADMIN").build();
                Role librarian = Role.builder().name("ROLE_LIBRARIAN").build();
                Role student = Role.builder().name("ROLE_STUDENT").build();

                roleRepository.saveAll(Arrays.asList(admin, librarian, student));
            }
        };
    }
}
