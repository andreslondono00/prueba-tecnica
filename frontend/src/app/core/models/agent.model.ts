export interface Agent {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    tickets_in_progress?: number;
    tickets_resolved?: number;
    total_tickets?: number;
}

export interface AgentMetrics {
    ticketsInProgress: number;
    ticketsResolved: number;
    totalTickets: number;
    resolutionRate?: number;
}

export interface CreateAgentRequest {
    name: string;
    email: string;
}

export interface UpdateAgentRequest {
    name?: string;
    email?: string;
}

export interface AgentResponse extends ApiResponse<Agent> { }
export interface AgentsResponse extends ApiResponse<Agent[]> { }

import { ApiResponse } from './api-response.model';