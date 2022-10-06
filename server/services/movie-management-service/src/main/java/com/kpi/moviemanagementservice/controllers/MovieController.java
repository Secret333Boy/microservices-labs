package com.kpi.moviemanagementservice.controllers;

import com.kpi.moviemanagementservice.models.Movie;
import com.kpi.moviemanagementservice.models.MovieFeedback;
import com.kpi.moviemanagementservice.services.MovieFeedbackService;
import com.kpi.moviemanagementservice.services.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;
    private final MovieFeedbackService movieFeedbackService;

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @GetMapping("/{movie_id}/feedbacks")
    public List<MovieFeedback> getAllMovieFeedbacks(@PathVariable("movie_id") Long movieId) {
        return movieFeedbackService.getAllMovieFeedbacks(movieId);
    }
}
