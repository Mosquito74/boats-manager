package com.boats.manager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoatResponseDto {
    private Integer id;
    private String name;
    private String description;
    private String type;
    private Integer length;
    private String make;
    private Integer launchYear;

    public BoatResponseDto() {
    }

    public BoatResponseDto(Integer id, String name, String description, String type, Integer length, String make, Integer launchYear) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.length = length;
        this.make = make;
        this.launchYear = launchYear;
    }
}
