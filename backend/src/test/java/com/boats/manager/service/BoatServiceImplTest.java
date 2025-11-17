package com.boats.manager.service;

import com.boats.manager.TestConfig;
import com.boats.manager.dto.BoatCreateDto;
import com.boats.manager.dto.BoatLightDto;
import com.boats.manager.dto.BoatResponseDto;
import com.boats.manager.exception.ResourceNotFoundException;
import com.boats.manager.model.Boat;
import com.boats.manager.repository.BoatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ContextConfiguration;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ContextConfiguration(classes = {TestConfig.class})
class BoatServiceImplTest {

    @Mock
    private BoatRepository boatRepository;

    @InjectMocks
    private BoatServiceImpl boatService;

    private Boat testBoat;
    private final int TEST_BOAT_ID = 1;

    @BeforeEach
    void setUp() {
        testBoat = new Boat();
        testBoat.setId(TEST_BOAT_ID);
        testBoat.setName("Test Boat");
        testBoat.setDescription("A test boat");
        testBoat.setType("Sailboat");
        testBoat.setLength(30);
        testBoat.setMake("Test Make");
        testBoat.setLaunchYear(2020);
    }

    @Test
    void getAllBoats_ShouldReturnAllBoats() {
        when(boatRepository.findAll()).thenReturn(Arrays.asList(testBoat));

        List<BoatLightDto> boats = boatService.getAllBoats();

        assertNotNull(boats);
        assertEquals(1, boats.size());
        assertEquals(testBoat.getName(), boats.get(0).getName());
        verify(boatRepository, times(1)).findAll();
    }

    @Test
    void getBoatById_WithValidId_ShouldReturnBoat() {
        when(boatRepository.findById(TEST_BOAT_ID)).thenReturn(Optional.of(testBoat));

        BoatResponseDto foundBoat = boatService.getBoatById(TEST_BOAT_ID);

        assertNotNull(foundBoat);
        assertEquals(testBoat.getName(), foundBoat.getName());
        verify(boatRepository, times(1)).findById(TEST_BOAT_ID);
    }

    @Test
    void getBoatById_WithInvalidId_ShouldThrowException() {
        when(boatRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> boatService.getBoatById(999));
        verify(boatRepository, times(1)).findById(999);
    }

    @Test
    void createBoat_WithValidData_ShouldReturnCreatedBoat() {
        BoatCreateDto newBoatDto = new BoatCreateDto();
        newBoatDto.setName("New Boat");
        newBoatDto.setDescription("New Description");
        newBoatDto.setType("Yacht");
        newBoatDto.setLength(40);
        newBoatDto.setMake("New Make");
        newBoatDto.setLaunchYear(2023);

        Boat savedBoat = new Boat();
        savedBoat.setId(2);
        savedBoat.setName(newBoatDto.getName());
        savedBoat.setDescription(newBoatDto.getDescription());
        savedBoat.setType(newBoatDto.getType());
        savedBoat.setLength(newBoatDto.getLength());
        savedBoat.setMake(newBoatDto.getMake());
        savedBoat.setLaunchYear(newBoatDto.getLaunchYear());

        when(boatRepository.save(any(Boat.class))).thenReturn(savedBoat);

        BoatResponseDto createdBoat = boatService.createBoat(newBoatDto);

        assertNotNull(createdBoat);
        assertEquals(2, createdBoat.getId());
        assertEquals("New Boat", createdBoat.getName());
        verify(boatRepository, times(1)).save(any(Boat.class));
    }

    @Test
    void updateBoat_WithValidData_ShouldReturnUpdatedBoat() {
        BoatCreateDto updatedDetails = new BoatCreateDto();
        updatedDetails.setName("Updated Boat");
        updatedDetails.setDescription("Updated description");
        updatedDetails.setType("Updated Type");
        updatedDetails.setLength(35);
        updatedDetails.setMake("Updated Make");
        updatedDetails.setLaunchYear(2024);

        when(boatRepository.findById(TEST_BOAT_ID)).thenReturn(Optional.of(testBoat));
        when(boatRepository.save(any(Boat.class))).thenReturn(testBoat);

        BoatResponseDto updatedBoat = boatService.updateBoat(TEST_BOAT_ID, updatedDetails);

        assertNotNull(updatedBoat);
        assertEquals("Updated Boat", updatedBoat.getName());
        assertEquals("Updated description", updatedBoat.getDescription());
        verify(boatRepository, times(1)).findById(TEST_BOAT_ID);
        verify(boatRepository, times(1)).save(testBoat);
    }

    @Test
    void updateBoat_WithInvalidId_ShouldThrowException() {
        when(boatRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> boatService.updateBoat(999, new BoatCreateDto()));
        verify(boatRepository, times(1)).findById(999);
        verify(boatRepository, never()).save(any());
    }

    @Test
    void deleteBoat_WithValidId_ShouldDeleteBoat() {
        when(boatRepository.findById(TEST_BOAT_ID)).thenReturn(Optional.of(testBoat));
        doNothing().when(boatRepository).delete(testBoat);

        boatService.deleteBoat(TEST_BOAT_ID);

        verify(boatRepository, times(1)).findById(TEST_BOAT_ID);
        verify(boatRepository, times(1)).delete(testBoat);
    }

    @Test
    void deleteBoat_WithInvalidId_ShouldThrowException() {
        when(boatRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> boatService.deleteBoat(999));
        verify(boatRepository, times(1)).findById(999);
        verify(boatRepository, never()).delete(any());
    }
}
