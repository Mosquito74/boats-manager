package com.boats.manager.web;

import com.boats.manager.dto.BoatCreateDto;
import com.boats.manager.dto.BoatLightDto;
import com.boats.manager.dto.BoatResponseDto;
import com.boats.manager.exception.GlobalExceptionHandler;
import com.boats.manager.exception.ResourceNotFoundException;
import com.boats.manager.service.BoatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class BoatsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BoatService boatService;

    @InjectMocks
    private BoatsController boatsController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private BoatResponseDto testBoat;
    private final int TEST_BOAT_ID = 1;

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

        mockMvc = MockMvcBuilders.standaloneSetup(boatsController)
                .setValidator(validator)
                .setControllerAdvice(exceptionHandler)
                .build();
                
        testBoat = new BoatResponseDto();
        testBoat.setId(TEST_BOAT_ID);
        testBoat.setName("Test Boat");
        testBoat.setDescription("A test boat");
        testBoat.setType("Sailboat");
        testBoat.setLength(30);
        testBoat.setMake("Test Make");
        testBoat.setLaunchYear(2020);
        
        reset(boatService);
    }

    @Test
    void getAllBoats_ShouldReturnListOfBoats() throws Exception {
        BoatLightDto boatLightDto = new BoatLightDto();
        boatLightDto.setName(testBoat.getName());
        when(boatService.getAllBoats()).thenReturn(List.of(boatLightDto));

        mockMvc.perform(get("/api/boats")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is(testBoat.getName())));

        verify(boatService, times(1)).getAllBoats();
    }

    @Test
    void getBoatById_WithValidId_ShouldReturnBoat() throws Exception {
        when(boatService.getBoatById(TEST_BOAT_ID)).thenReturn(testBoat);

        mockMvc.perform(get("/api/boats/" + TEST_BOAT_ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(TEST_BOAT_ID)))
                .andExpect(jsonPath("$.name", is(testBoat.getName())));

        verify(boatService, times(1)).getBoatById(TEST_BOAT_ID);
    }

    @Test
    void getBoatById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        when(boatService.getBoatById(anyInt())).thenThrow(new ResourceNotFoundException("Boat not found"));

        mockMvc.perform(get("/api/boats/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(boatService, times(1)).getBoatById(999);
    }

    @Test
    void createBoat_WithValidData_ShouldReturnCreatedBoat() throws Exception {
        BoatCreateDto newBoatDto = new BoatCreateDto();
        newBoatDto.setName("New Boat");
        newBoatDto.setDescription("New Description");
        newBoatDto.setType("Sailboat");
        newBoatDto.setLength(40);
        newBoatDto.setMake("New Make");
        newBoatDto.setLaunchYear(2023);

        BoatResponseDto responseDto = new BoatResponseDto();
        responseDto.setName("New Boat");
        responseDto.setDescription("New Description");
        responseDto.setType("Sailboat");
        responseDto.setLength(40);
        responseDto.setMake("New Make");
        responseDto.setLaunchYear(2023);
        responseDto.setId(1);

        when(boatService.createBoat(any(BoatCreateDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/boats")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newBoatDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("New Boat")));

        verify(boatService, times(1)).createBoat(any(BoatCreateDto.class));
    }

    @Test
    void updateBoat_WithValidData_ShouldReturnUpdatedBoat() throws Exception {
        BoatCreateDto updateDto = new BoatCreateDto();
        updateDto.setName("Updated Boat");
        updateDto.setDescription("Updated Description");
        updateDto.setType("Updated Type");
        updateDto.setLength(35);
        updateDto.setMake("Updated Make");
        updateDto.setLaunchYear(2024);
        
        BoatResponseDto responseDto = new BoatResponseDto();
        responseDto.setName("Updated Boat");
        responseDto.setDescription("Updated Description");
        responseDto.setType("Updated Type");
        responseDto.setLength(35);
        responseDto.setMake("Updated Make");
        responseDto.setLaunchYear(2024);

        when(boatService.updateBoat(eq(TEST_BOAT_ID), any(BoatCreateDto.class))).thenReturn(responseDto);

        mockMvc.perform(put("/api/boats/" + TEST_BOAT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Boat")));

        verify(boatService, times(1)).updateBoat(eq(TEST_BOAT_ID), any(BoatCreateDto.class));
    }

    @Test
    void deleteBoat_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(boatService).deleteBoat(TEST_BOAT_ID);

        mockMvc.perform(delete("/api/boats/" + TEST_BOAT_ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(boatService, times(1)).deleteBoat(TEST_BOAT_ID);
    }

    @Test
    void createBoat_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        BoatCreateDto invalidBoat = new BoatCreateDto();
        invalidBoat.setName("");
        invalidBoat.setLength(-1);

        mockMvc.perform(post("/api/boats")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidBoat)))
                .andDo(print())
                .andExpect(status().isBadRequest());

        verify(boatService, never()).createBoat(any());
    }

    @Test
    void createBoat_WithNameExceedingMaxLength_ShouldReturnBadRequest() throws Exception {
        String longName = "A".repeat(51);
        
        BoatCreateDto invalidBoat = new BoatCreateDto();
        invalidBoat.setName(longName);
        invalidBoat.setDescription("Valid description");
        invalidBoat.setType("Yacht");
        invalidBoat.setLength(30);
        invalidBoat.setMake("Sea Ray");
        invalidBoat.setLaunchYear(2020);

        mockMvc.perform(post("/api/boats")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidBoat)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Validation failed")))
                .andExpect(jsonPath("$.errors.name", 
                    is("Name must be less than 50 characters long")));

        verify(boatService, never()).createBoat(any());
    }
}
