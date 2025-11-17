package com.boats.manager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Boat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column
    private String type;

    @Positive(message = "Length must be a positive number")
    @Column
    private Integer length;

    @Column
    private String make;

    @Column
    private Integer launchYear;


}
