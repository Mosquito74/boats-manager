package com.boats.manager.service;

import com.boats.manager.dto.BoatCreateDto;
import com.boats.manager.dto.BoatLightDto;
import com.boats.manager.dto.BoatResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BoatService {

    List<BoatLightDto> getAllBoats();

    BoatResponseDto getBoatById(int id);

    BoatResponseDto createBoat(BoatCreateDto boat);

    BoatResponseDto updateBoat(int id, BoatCreateDto boatDetails);
    
    void deleteBoat(int id);
}
