export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED'
}

export interface Ticket {
    id: number;
    client_id: number;
    agent_id: number | null;
    title: string;
    description: string;
    status: TicketStatus;
    resolution: string | null;
    created_at: string;
    updated_at: string;
    client_name?: string;
    client_email?: string;
    agent_name?: string;
    agent_email?: string;
}

export interface CreateTicketRequest {
    clientId: number;
    title: string;
    description: string;
    status?: TicketStatus;
}

export interface UpdateTicketRequest {
    title?: string;
    description?: string;
}

export interface AssignAgentRequest {
    agentId: number;
}

export interface UpdateStatusRequest {
    status: TicketStatus;
    resolution?: string;
}

export interface TicketFilters {
    status?: TicketStatus;
    clientId?: number;
    agentId?: number;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
}

export interface TicketResponse extends ApiResponse<Ticket> { }
export interface TicketsResponse extends ApiResponse<Ticket[]> { }

import { ApiResponse } from './api-response.model';