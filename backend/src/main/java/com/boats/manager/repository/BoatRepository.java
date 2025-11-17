package com.boats.manager.repository;

import com.boats.manager.model.Boat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoatRepository extends JpaRepository<Boat, Integer> {

    Optional<Boat> findById(int id);

}
