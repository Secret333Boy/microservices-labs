package com.kpi.moviemanagementservice.services;

import com.kpi.moviemanagementservice.models.MovieFeedback;
import com.kpi.moviemanagementservice.repositories.MockMovieFeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieFeedbackService {
    private final MockMovieFeedbackRepository mockMovieFeedbackRepository;

    public List<MovieFeedback> getAllMovieFeedbacks(Long movieId) {
        return mockMovieFeedbackRepository.getMovieFeedbacks().stream().filter(movieFeedback -> movieFeedback.getMovie().getId().equals(movieId)).collect(Collectors.toList());
    }
}