package com.boats.manager.service;

import com.boats.manager.dto.BoatCreateDto;
import com.boats.manager.dto.BoatLightDto;
import com.boats.manager.dto.BoatResponseDto;
import com.boats.manager.exception.ResourceNotFoundException;
import com.boats.manager.model.Boat;
import com.boats.manager.repository.BoatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoatServiceImpl implements BoatService {

    private final BoatRepository boatRepository;

    @Autowired
    public BoatServiceImpl(BoatRepository boatRepository) {
        this.boatRepository = boatRepository;
    }

    @Override
    public List<BoatLightDto> getAllBoats() {
        return boatRepository.findAll().stream()
                .map(boat -> new BoatLightDto(boat.getId(), boat.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public BoatResponseDto getBoatById(int id) {
        Boat boat = boatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boat not found with id: " + id));
        return convertToResponseDto(boat);
    }

    @Override
    public BoatResponseDto createBoat(BoatCreateDto boatDto) {
        Boat boat = new Boat();
        updateBoatFromDto(boat, boatDto);
        Boat savedBoat = boatRepository.save(boat);
        return convertToResponseDto(savedBoat);
    }

    @Override
    public BoatResponseDto updateBoat(int id, BoatCreateDto boatDto) {
        Boat boat = boatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boat not found with id: " + id));
        updateBoatFromDto(boat, boatDto);
        Boat updatedBoat = boatRepository.save(boat);
        return convertToResponseDto(updatedBoat);
    }

    @Override
    public void deleteBoat(int id) {
        Boat boat = boatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boat not found with id: " + id));
        boatRepository.delete(boat);
    }

    private void updateBoatFromDto(Boat boat, BoatCreateDto dto) {
        if (dto.getName() != null) boat.setName(dto.getName());
        if (dto.getDescription() != null) boat.setDescription(dto.getDescription());
        if (dto.getType() != null) boat.setType(dto.getType());
        if (dto.getLength() != null) boat.setLength(dto.getLength());
        if (dto.getMake() != null) boat.setMake(dto.getMake());
        if (dto.getLaunchYear() != null) boat.setLaunchYear(dto.getLaunchYear());
    }

    private BoatResponseDto convertToResponseDto(Boat boat) {
        return new BoatResponseDto(
                boat.getId(),
                boat.getName(),
                boat.getDescription(),
                boat.getType(),
                boat.getLength(),
                boat.getMake(),
                boat.getLaunchYear()
        );
    }
}
