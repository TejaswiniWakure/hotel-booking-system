package com.hotel.controller;

import com.hotel.entity.Room;
import com.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.ok(savedRoom);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        return roomRepository.findById(id).map(room -> {
            room.setRoomName(roomDetails.getRoomName());
            room.setPrice(roomDetails.getPrice());
            room.setAvailability(roomDetails.getAvailability());
            room.setImage(roomDetails.getImage());
            room.setDescription(roomDetails.getDescription());
            return ResponseEntity.ok(roomRepository.save(room));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        return roomRepository.findById(id).map(room -> {
            roomRepository.delete(room);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
