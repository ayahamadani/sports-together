package com.example.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "challenge_participants",
    uniqueConstraints = @UniqueConstraint(columnNames = {"challenge_id", "user_id"}))
public class ChallengeParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double progress = 0.0; // accumulated value toward goal

    // Constructors
    public ChallengeParticipant() {}
    public ChallengeParticipant(Challenge challenge, User user) {
        this.challenge = challenge;
        this.user = user;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public Challenge getChallenge() { return challenge; }
    public void setChallenge(Challenge challenge) { this.challenge = challenge; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Double getProgress() { return progress; }
    public void setProgress(Double progress) { this.progress = progress; }
}
