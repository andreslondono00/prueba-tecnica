import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Client,
    ClientResponse,
    ClientsResponse,
    CreateClientRequest,
    UpdateClientRequest
} from '../models/client.model';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private endpoint = '/clients';

    constructor(private api: ApiService) { }

    createClient(clientData: CreateClientRequest): Observable<ClientResponse> {
        return this.api.post<ClientResponse>(this.endpoint, clientData);
    }

    getClients(page: number = 1, pageSize: number = 10): Observable<ClientsResponse> {
        return this.api.get<ClientsResponse>(this.endpoint, { page, pageSize });
    }

    getClient(id: number): Observable<ClientResponse> {
        return this.api.get<ClientResponse>(`${this.endpoint}/${id}`);
    }

    updateClient(id: number, data: UpdateClientRequest): Observable<ClientResponse> {
        return this.api.put<ClientResponse>(`${this.endpoint}/${id}`, data);
    }

    searchClients(query: string): Observable<ClientsResponse> {
        return this.api.get<ClientsResponse>(this.endpoint, { search: query });
    }
}