package com.library.repository;

import com.library.entity.Fine;
import com.library.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByUserAndStatus(User user, Fine.FineStatus status);
    List<Fine> findByUser(User user);
}
