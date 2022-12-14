package com.kpi.omelian.booking_service.service;

import com.kpi.omelian.booking_service.entity.Session;
import com.kpi.omelian.booking_service.entity.dto.SessionDto;
import com.kpi.omelian.booking_service.entity.dto.TicketDto;
import com.kpi.omelian.booking_service.exception.NonExistedSessionError;

import java.util.List;

public interface ISessionService {

    Session save(SessionDto sessionDto);

    List<Session> findAllSessions();

    void delete(Long sessionId) throws NonExistedSessionError;

}
