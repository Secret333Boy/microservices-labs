package com.kpi.moviemanagementservice.controllers;

import com.kpi.moviemanagementservice.models.Cinema;
import com.kpi.moviemanagementservice.models.CinemaFeedback;
import com.kpi.moviemanagementservice.services.CinemaFeedbackService;
import com.kpi.moviemanagementservice.services.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cinemas")
@RequiredArgsConstructor
public class CinemaController {

    private final CinemaService cinemaService;
    private final CinemaFeedbackService cinemaFeedbackService;

    @GetMapping
    public List<Cinema> getAll() {
        return cinemaService.getAllCinemas();
    }

    @GetMapping("/{id}")
    public Cinema getCinema(@PathVariable Long id) {
        return cinemaService.getCinemaById(id);
    }

    @GetMapping("/{movie_id}/feedbacks")
    public List<CinemaFeedback> getAllCinemaFeedbacks(@PathVariable("movie_id") Long movieId) {
        return cinemaFeedbackService.getAllCinemaFeedbacks(movieId);
    }
}