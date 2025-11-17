package com.boats.manager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoatLightDto {
    private Integer id;
    private String name;

    public BoatLightDto() {
    }

    public BoatLightDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

}
