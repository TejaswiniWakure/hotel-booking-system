package com.hotel.controller;

import com.hotel.entity.Booking;
import com.hotel.entity.Room;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RoomRepository roomRepository;

    @PostMapping("/book-room")
    public ResponseEntity<?> bookRoom(@RequestBody Booking booking) {
        // In a real app, user ID comes from JWT token
        if (booking.getUserId() == null) {
            booking.setUserId(1L); // Mock user ID for demo
        }
        
        booking.setStatus("CONFIRMED");
        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestHeader(value = "Authorization", required = false) String token) {
        // In a real app, extract user ID from token
        Long mockUserId = 1L; // Mock user ID for demo
        if (token != null && token.contains("admin")) {
            return ResponseEntity.ok(bookingRepository.findAll()); // Admin sees all
        }

        List<Booking> bookings = bookingRepository.findByUserId(mockUserId);
        
        // Enrich with room names for the frontend
        bookings = bookings.stream().map(b -> {
            Optional<Room> room = roomRepository.findById(b.getRoomId());
            room.ifPresent(r -> b.setRoomName(r.getRoomName()));
            return b;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/cancel-booking/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
    
    // Admin endpoints
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
