package com.example.backend.Service;

import com.example.backend.Entity.Activity;
import com.example.backend.Entity.Friendship;
import com.example.backend.Entity.Friendship.Status;
import com.example.backend.Entity.User;
import com.example.backend.Repository.FriendshipRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendService {

    private final FriendshipRepository friendshipRepository;
    private final UserService userService;
    private final ActivityService activityService;

    public FriendService(FriendshipRepository friendshipRepository,
                         UserService userService,
                         ActivityService activityService) {
        this.friendshipRepository = friendshipRepository;
        this.userService = userService;
        this.activityService = activityService;
    }

    public Friendship sendRequest(Long requesterId, Long receiverId) {
        if (requesterId.equals(receiverId)) throw new RuntimeException("Cannot friend yourself");
        friendshipRepository.findBetween(requesterId, receiverId).ifPresent(f -> {
            throw new RuntimeException("Friendship already exists");
        });
        User requester = userService.findById(requesterId);
        User receiver = userService.findById(receiverId);
        return friendshipRepository.save(new Friendship(requester, receiver));
    }

    public Friendship accept(Long currentUserId, Long requesterId) {
        Friendship f = friendshipRepository.findBetween(requesterId, currentUserId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        if (!f.getReceiver().getId().equals(currentUserId)) throw new RuntimeException("Forbidden");
        f.setStatus(Status.ACCEPTED);
        return friendshipRepository.save(f);
    }

    public void decline(Long currentUserId, Long otherId) {
        Friendship f = friendshipRepository.findBetween(otherId, currentUserId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        friendshipRepository.delete(f);
    }

    /** Returns all users who are friends or have pending requests with this user */
    public List<Friendship> getFriendships(Long userId) {
        List<Friendship> pending = friendshipRepository.findByUserAndStatus(userId, Status.PENDING);
        List<Friendship> accepted = friendshipRepository.findByUserAndStatus(userId, Status.ACCEPTED);
        pending.addAll(accepted);
        return pending;
    }

    /** Returns the IDs of accepted friends */
    public List<Long> getFriendIds(Long userId) {
        return friendshipRepository.findByUserAndStatus(userId, Status.ACCEPTED)
                .stream()
                .map(f -> f.getRequester().getId().equals(userId)
                        ? f.getReceiver().getId()
                        : f.getRequester().getId())
                .collect(Collectors.toList());
    }

    public List<Activity> getFriendFeed(Long userId) {
        List<Long> friendIds = getFriendIds(userId);
        return activityService.getFeedForFriendIds(friendIds);
    }
}
