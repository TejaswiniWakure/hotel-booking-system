package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    
    private Long roomId;
    
    @Transient
    private String roomName; // For returning to frontend easily
    
    private LocalDate checkIn;
    
    private LocalDate checkOut;
    
    // CONFIRMED, CANCELLED, COMPLETED
    private String status = "CONFIRMED";
}
