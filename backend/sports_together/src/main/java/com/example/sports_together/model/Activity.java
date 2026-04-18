package com.example.sports_together.model;

@Entity @Data
public class Activity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private User user;
    private String sportType, notes;
    private Double duration, distance, calories;
    private LocalDateTime date;
    private String weatherDescription;
    private Double temperature;
}

