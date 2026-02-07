import { Ticket } from './ticket.model';

export interface Client {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    tickets?: Ticket[];
}

export interface CreateClientRequest {
    name: string;
    email: string;
}

export interface UpdateClientRequest {
    name?: string;
    email?: string;
}

export interface ClientResponse extends ApiResponse<Client> { }
export interface ClientsResponse extends ApiResponse<Client[]> { }

// Importar ApiResponse del archivo correspondiente
import { ApiResponse } from './api-response.model';