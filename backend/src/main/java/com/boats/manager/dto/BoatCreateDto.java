package com.boats.manager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoatCreateDto {
    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "Name must be less than 50 characters long")
    private String name;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters long")
    private String description;

    @Size(max = 50, message = "Type must be less than 50 characters long")
    private String type;
    
    @Positive(message = "Length must be a positive number")
    private Integer length;

    @Size(max = 50, message = "Make must be less than 50 characters long")
    private String make;

    private Integer launchYear;

    public BoatCreateDto() {
    }

    public BoatCreateDto(String name, String description, String type, Integer length, String make, Integer launchYear) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.length = length;
        this.make = make;
        this.launchYear = launchYear;
    }
}
