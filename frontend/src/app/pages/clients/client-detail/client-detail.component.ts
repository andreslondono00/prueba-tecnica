import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../../core/services/clients.service';
import { TicketsService } from '../../../core/services/tickets.service';
import { Client, UpdateClientRequest } from '../../../core/models/client.model';
import { Ticket } from '../../../core/models/ticket.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-client-detail',
    templateUrl: './client-detail.component.html',
    styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
    client: Client | null = null;
    tickets: Ticket[] = [];
    isLoading = false;
    isEditing = false;
    isSaving = false;

    clientForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private clientsService: ClientsService,
        private ticketsService: TicketsService,
        private toastr: ToastrService
    ) {
        this.clientForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadClient(parseInt(id));
        }
    }

    loadClient(id: number): void {
        this.isLoading = true;
        this.clientsService.getClient(id).subscribe({
            next: (response) => {
                this.client = response.data;
                this.loadClientTickets(id);
                this.clientForm.patchValue({
                    name: this.client.name,
                    email: this.client.email
                });
            },
            error: (error) => {
                this.toastr.error('Failed to load client');
                this.router.navigate(['/clients']);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    loadClientTickets(clientId: number): void {
        this.ticketsService.getTickets({ clientId }).subscribe({
            next: (response) => {
                this.tickets = response.data;
            },
            error: (error) => {
                console.error('Failed to load client tickets:', error);
            }
        });
    }

    startEdit(): void {
        this.isEditing = true;
    }

    cancelEdit(): void {
        this.isEditing = false;
        if (this.client) {
            this.clientForm.patchValue({
                name: this.client.name,
                email: this.client.email
            });
        }
    }

    saveClient(): void {
        if (this.clientForm.invalid || !this.client) return;

        this.isSaving = true;
        const updateData: UpdateClientRequest = this.clientForm.value;

        this.clientsService.updateClient(this.client.id, updateData).subscribe({
            next: (response) => {
                this.client = response.data;
                this.isEditing = false;
                this.toastr.success('Client updated successfully');
            },
            error: (error) => {
                this.toastr.error('Failed to update client');
                console.error(error);
            },
            complete: () => {
                this.isSaving = false;
            }
        });
    }

    viewTicket(ticketId: number): void {
        this.router.navigate(['/tickets', ticketId]);
    }

    createTicket(): void {
        if (this.client) {
            this.router.navigate(['/tickets/new'], {
                queryParams: { clientId: this.client.id }
            });
        }
    }

    getTicketStatusClass(status: string): string {
        switch (status) {
            case 'OPEN': return 'status-badge status-open';
            case 'IN_PROGRESS': return 'status-badge status-in-progress';
            case 'RESOLVED': return 'status-badge status-resolved';
            default: return 'status-badge';
        }
    }

    getTicketStatusLabel(status: string): string {
        switch (status) {
            case 'OPEN': return 'Open';
            case 'IN_PROGRESS': return 'In Progress';
            case 'RESOLVED': return 'Resolved';
            default: return status;
        }
    }

    // Añadir esta función
    goBack(): void {
        this.router.navigate(['/clients']);
    }
}