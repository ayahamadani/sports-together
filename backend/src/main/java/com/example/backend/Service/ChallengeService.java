package com.example.backend.Service;

import com.example.backend.Entity.Challenge;
import com.example.backend.Entity.ChallengeParticipant;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ChallengeParticipantRepository;
import com.example.backend.Repository.ChallengeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantRepository participantRepository;
    private final UserService userService;

    public ChallengeService(ChallengeRepository challengeRepository,
                            ChallengeParticipantRepository participantRepository,
                            UserService userService) {
        this.challengeRepository = challengeRepository;
        this.participantRepository = participantRepository;
        this.userService = userService;
    }

    public List<Challenge> getAll() {
        return challengeRepository.findAllByOrderByEndDateAsc();
    }

    public Challenge create(Long creatorId, String title, String type, String metric,
                            Double goal, String unit, String endDate) {
        User creator = userService.findById(creatorId);
        Challenge c = new Challenge();
        c.setTitle(title);
        c.setType(type);
        c.setMetric(metric);
        c.setGoal(goal);
        c.setUnit(unit);
        c.setEndDate(endDate);
        c.setCreator(creator);
        Challenge saved = challengeRepository.save(c);
        // Creator automatically joins
        participantRepository.save(new ChallengeParticipant(saved, creator));
        return saved;
    }

    public void join(Long challengeId, Long userId) {
        if (participantRepository.existsByChallengeIdAndUserId(challengeId, userId)) {
            throw new RuntimeException("Already joined");
        }
        Challenge c = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));
        User u = userService.findById(userId);
        participantRepository.save(new ChallengeParticipant(c, u));
    }

    public List<ChallengeParticipant> getLeaderboard(Long challengeId) {
        return participantRepository.findByChallengeIdOrderByProgressDesc(challengeId);
    }

    public boolean isJoined(Long challengeId, Long userId) {
        return participantRepository.existsByChallengeIdAndUserId(challengeId, userId);
    }

    public double getProgress(Long challengeId, Long userId) {
        return participantRepository.findByChallengeIdAndUserId(challengeId, userId)
                .map(ChallengeParticipant::getProgress)
                .orElse(0.0);
    }
}
