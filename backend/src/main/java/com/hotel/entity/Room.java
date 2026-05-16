package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;
    
    private Double price;
    
    private Boolean availability = true;
    
    private String image;
    
    @Column(length = 1000)
    private String description;
    
    private Double rating;
}
