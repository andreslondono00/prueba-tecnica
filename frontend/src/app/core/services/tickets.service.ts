import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Ticket,
    TicketResponse,
    TicketsResponse,
    CreateTicketRequest,
    UpdateTicketRequest,
    AssignAgentRequest,
    UpdateStatusRequest,
    TicketFilters
} from '../models/ticket.model';

@Injectable({
    providedIn: 'root'
})
export class TicketsService {
    private endpoint = '/tickets';

    constructor(private api: ApiService) { }

    createTicket(ticketData: CreateTicketRequest): Observable<TicketResponse> {
        return this.api.post<TicketResponse>(this.endpoint, ticketData);
    }

    getTickets(filters: TicketFilters = {}): Observable<TicketsResponse> {
        return this.api.get<TicketsResponse>(this.endpoint, filters);
    }

    getTicket(id: number): Observable<TicketResponse> {
        return this.api.get<TicketResponse>(`${this.endpoint}/${id}`);
    }

    updateTicket(id: number, data: UpdateTicketRequest): Observable<TicketResponse> {
        return this.api.put<TicketResponse>(`${this.endpoint}/${id}`, data);
    }

    assignAgent(ticketId: number, agentId: number): Observable<TicketResponse> {
        return this.api.patch<TicketResponse>(
            `${this.endpoint}/${ticketId}/assign`,
            { agentId }
        );
    }

    updateStatus(ticketId: number, status: string, resolution?: string): Observable<TicketResponse> {
        const data: UpdateStatusRequest = { status: status as any };
        if (resolution) {
            data.resolution = resolution;
        }
        return this.api.patch<TicketResponse>(
            `${this.endpoint}/${ticketId}/status`,
            data
        );
    }
}