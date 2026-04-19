package com.example.backend.Service;

import com.example.backend.Entity.Comment;
import com.example.backend.Entity.Reaction;
import com.example.backend.Repository.CommentRepository;
import com.example.backend.Repository.ReactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final ActivityService activityService;
    private final UserService userService;

    public CommentService(CommentRepository commentRepository,
                          ReactionRepository reactionRepository,
                          ActivityService activityService,
                          UserService userService) {
        this.commentRepository = commentRepository;
        this.reactionRepository = reactionRepository;
        this.activityService = activityService;
        this.userService = userService;
    }

    public Comment addComment(Long activityId, Long authorId, String text) {
        Comment c = new Comment(
                activityService.findById(activityId),
                userService.findById(authorId),
                text);
        return commentRepository.save(c);
    }

    public List<Comment> getComments(Long activityId) {
        return commentRepository.findByActivityIdOrderByCreatedAtAsc(activityId);
    }

    public void addReaction(Long activityId, Long userId, String type) {
        // Toggle: if already reacted with same type, remove it
        reactionRepository.findByActivityIdAndUserIdAndType(activityId, userId, type)
                .ifPresentOrElse(
                        reactionRepository::delete,
                        () -> reactionRepository.save(new Reaction(
                                activityService.findById(activityId),
                                userService.findById(userId),
                                type))
                );
    }

    public Map<String, Long> getReactionCounts(Long activityId) {
        return reactionRepository.countByTypeForActivity(activityId)
                .stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));
    }
}
