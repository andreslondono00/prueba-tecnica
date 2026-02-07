import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from '../../../core/services/tickets.service';
import { ClientsService } from '../../../core/services/clients.service';
import { CreateTicketRequest } from '../../../core/models/ticket.model';
import { Client } from '../../../core/models/client.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-ticket-form',
    templateUrl: './ticket-form.component.html',
    styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent implements OnInit {
    ticketForm: FormGroup;
    clients: Client[] = [];
    isLoading = false;
    loadingClients = false;

    constructor(
        private fb: FormBuilder,
        private ticketsService: TicketsService,
        private clientsService: ClientsService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.ticketForm = this.fb.group({
            clientId: ['', [Validators.required]],
            title: ['', [Validators.required, Validators.minLength(5)]],
            description: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit(): void {
        this.loadClients();

        // Pre-seleccionar cliente si viene de la página de cliente
        this.route.queryParams.subscribe(params => {
            if (params['clientId']) {
                this.ticketForm.patchValue({
                    clientId: params['clientId']
                });
            }
        });
    }

    loadClients(): void {
        this.loadingClients = true;
        this.clientsService.getClients(1, 100).subscribe({
            next: (response) => {
                this.clients = response.data;
            },
            error: (error) => {
                console.error('Failed to load clients:', error);
            },
            complete: () => {
                this.loadingClients = false;
            }
        });
    }

    onSubmit(): void {
        if (this.ticketForm.invalid) {
            this.markFormGroupTouched(this.ticketForm);
            return;
        }

        this.isLoading = true;
        const ticketData: CreateTicketRequest = {
            ...this.ticketForm.value,
            clientId: parseInt(this.ticketForm.value.clientId)
        };

        this.ticketsService.createTicket(ticketData).subscribe({
            next: (response) => {
                this.toastr.success('Ticket created successfully');
                this.router.navigate(['/tickets', response.data.id]);
            },
            error: (error) => {
                this.toastr.error(error.message || 'Failed to create ticket');
                console.error(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/tickets']);
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    get clientId() { return this.ticketForm.get('clientId'); }
    get title() { return this.ticketForm.get('title'); }
    get description() { return this.ticketForm.get('description'); }
}