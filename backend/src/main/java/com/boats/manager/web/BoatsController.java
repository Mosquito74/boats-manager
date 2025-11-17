package com.boats.manager.web;

import com.boats.manager.dto.BoatCreateDto;
import com.boats.manager.dto.BoatLightDto;
import com.boats.manager.dto.BoatResponseDto;
import com.boats.manager.service.BoatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Tag(name = "Boat Controller", description = "APIs for managing boats")
@RestController
@RequestMapping("/api/boats")
@Validated
public class BoatsController {

    private final BoatService boatService;

    public BoatsController(BoatService boatService) {
        this.boatService = boatService;
    }

    @Operation(summary = "Get all boats", description = "Returns a lightweight list of all boats")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    @GetMapping(produces = "application/json")
    public List<BoatLightDto> findAllBoats() {
        return boatService.getAllBoats();
    }

    @Operation(summary = "Get boat by ID",
            description = "Returns detailed information about a single boat")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved boat details"),
            @ApiResponse(responseCode = "404", description = "Boat not found")
    })
    @GetMapping(value = "/{id}", produces = "application/json")
    public BoatResponseDto getBoatById(@PathVariable int id) {
        return boatService.getBoatById(id);
    }

    @Operation(summary = "Create a new boat",
            description = "Creates a new boat with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Boat created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<BoatResponseDto> createBoat(@Valid @RequestBody BoatCreateDto boatDto) {
        BoatResponseDto createdBoat = boatService.createBoat(boatDto);
        return new ResponseEntity<>(createdBoat, HttpStatus.CREATED);
    }

    @Operation(summary = "Update a boat",
            description = "Updates an existing boat with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Boat updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Boat not found")
    })
    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public BoatResponseDto updateBoat(@PathVariable int id, @Valid @RequestBody BoatCreateDto boatDto) {
        return boatService.updateBoat(id, boatDto);
    }

    @Operation(summary = "Delete a boat",
            description = "Deletes a boat by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Boat deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Boat not found")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBoat(@PathVariable int id) {
        boatService.deleteBoat(id);
    }
}
