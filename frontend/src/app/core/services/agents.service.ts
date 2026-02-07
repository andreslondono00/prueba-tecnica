import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Agent,
    AgentResponse,
    AgentsResponse,
    CreateAgentRequest,
    UpdateAgentRequest
} from '../models/agent.model';

@Injectable({
    providedIn: 'root'
})
export class AgentsService {
    private endpoint = '/agents';

    constructor(private api: ApiService) { }

    createAgent(agentData: CreateAgentRequest): Observable<AgentResponse> {
        return this.api.post<AgentResponse>(this.endpoint, agentData);
    }

    getAgents(page: number = 1, pageSize: number = 10): Observable<AgentsResponse> {
        return this.api.get<AgentsResponse>(this.endpoint, { page, pageSize });
    }

    getAgent(id: number): Observable<AgentResponse> {
        return this.api.get<AgentResponse>(`${this.endpoint}/${id}`);
    }

    updateAgent(id: number, data: UpdateAgentRequest): Observable<AgentResponse> {
        return this.api.put<AgentResponse>(`${this.endpoint}/${id}`, data);
    }

    searchAgents(query: string): Observable<AgentsResponse> {
        return this.api.get<AgentsResponse>(this.endpoint, { search: query });
    }
}