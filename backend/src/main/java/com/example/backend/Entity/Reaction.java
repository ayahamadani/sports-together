package com.example.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "reactions",
    uniqueConstraints = @UniqueConstraint(columnNames = {"activity_id", "user_id", "type"}))
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // 👍 🔥 💪

    // Constructors
    public Reaction() {}
    public Reaction(Activity activity, User user, String type) {
        this.activity = activity;
        this.user = user;
        this.type = type;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public Activity getActivity() { return activity; }
    public void setActivity(Activity activity) { this.activity = activity; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
