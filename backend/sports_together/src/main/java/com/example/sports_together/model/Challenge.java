package com.example.sports_together.model;

@Entity @Data
public class Challenge {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name, description, metric, sportType;
    private LocalDate startDate, endDate;
    @ManyToOne private User creator;
    @ManyToMany private Set<User> participants = new HashSet<>();
}
