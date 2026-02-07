import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from '../../../core/services/tickets.service';
import { ClientsService } from '../../../core/services/clients.service';
import { AgentsService } from '../../../core/services/agents.service';
import { Ticket, TicketStatus, TicketFilters } from '../../../core/models/ticket.model';
import { Client } from '../../../core/models/client.model';
import { Agent } from '../../../core/models/agent.model';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessageComponent } from '../../../components/shared/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-ticket-list',
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.css'],
    imports: [ErrorMessageComponent, LoadingSpinnerComponent, DatePipe, ReactiveFormsModule, CommonModule],
    standalone: true
})
export class TicketListComponent implements OnInit {
    // Propiedades principales
    tickets: Ticket[] = [];
    clients: Client[] = [];
    agents: Agent[] = [];
    filtersForm: FormGroup;

    // Estados y paginación
    isLoading = false;
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    totalPages = 0;

    // Propiedad errorMessage añadida aquí
    errorMessage?: string;

    readonly statusOptions = [
        { value: '', label: 'All Status' },
        { value: TicketStatus.OPEN, label: 'Open' },
        { value: TicketStatus.IN_PROGRESS, label: 'In Progress' },
        { value: TicketStatus.RESOLVED, label: 'Resolved' }
    ];

    constructor(
        private fb: FormBuilder,
        private ticketsService: TicketsService,
        private clientsService: ClientsService,
        private agentsService: AgentsService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.filtersForm = this.fb.group({
            status: [''],
            clientId: [''],
            agentId: [''],
            from: [''],
            to: ['']
        });
    }

    ngOnInit(): void {
        this.loadClients();
        this.loadAgents();
        this.loadTickets();

        this.route.queryParams.subscribe(params => {
            if (Object.keys(params).length > 0) {
                this.filtersForm.patchValue(params);
                this.currentPage = params['page'] || 1;
                this.loadTickets();
            }
        });
    }

    loadTickets(): void {
        this.isLoading = true;
        this.errorMessage = undefined; // Limpiar error previo

        const filters: TicketFilters = {
            ...this.filtersForm.value,
            page: this.currentPage,
            pageSize: this.pageSize
        };

        // Limpiar filtros vacíos
        Object.keys(filters).forEach(key => {
            if (filters[key as keyof TicketFilters] === '') {
                delete filters[key as keyof TicketFilters];
            }
        });

        this.ticketsService.getTickets(filters).subscribe({
            next: (response) => {
                this.tickets = response.data;
                this.totalItems = response.pagination?.total || 0;
                this.totalPages = response.pagination?.totalPages || 0;
                this.updateQueryParams();
            },
            error: (error) => {
                this.errorMessage = error.message || 'Failed to load tickets';
                this.toastr.error(this.errorMessage);
                console.error(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    loadClients(): void {
        this.clientsService.getClients(1, 100).subscribe({
            next: (response) => {
                this.clients = response.data;
            },
            error: (error) => {
                console.error('Failed to load clients:', error);
            }
        });
    }

    loadAgents(): void {
        this.agentsService.getAgents(1, 100).subscribe({
            next: (response) => {
                this.agents = response.data;
            },
            error: (error) => {
                console.error('Failed to load agents:', error);
            }
        });
    }

    applyFilters(): void {
        this.currentPage = 1;
        this.loadTickets();
    }

    clearFilters(): void {
        this.filtersForm.reset();
        this.currentPage = 1;
        this.loadTickets();
    }

    viewTicket(ticketId: number): void {
        this.router.navigate(['/tickets', ticketId]);
    }

    createTicket(): void {
        this.router.navigate(['/tickets/new']);
    }

    getStatusClass(status: TicketStatus): string {
        switch (status) {
            case TicketStatus.OPEN: return 'status-badge status-open';
            case TicketStatus.IN_PROGRESS: return 'status-badge status-in-progress';
            case TicketStatus.RESOLVED: return 'status-badge status-resolved';
            default: return 'status-badge';
        }
    }

    getStatusLabel(status: TicketStatus): string {
        switch (status) {
            case TicketStatus.OPEN: return 'Open';
            case TicketStatus.IN_PROGRESS: return 'In Progress';
            case TicketStatus.RESOLVED: return 'Resolved';
            default: return status;
        }
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadTickets();
    }

    // Método helper para obtener el mínimo de dos números
    min(a: number, b: number): number {
        return a < b ? a : b;
    }

    // Método para calcular el texto de paginación
    getPaginationText(): string {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = this.min(this.currentPage * this.pageSize, this.totalItems);
        return `Showing ${start} to ${end} of ${this.totalItems} tickets`;
    }

    hasActiveFilters(): boolean {
        const formValue = this.filtersForm.value;
        return !!(formValue.status || formValue.clientId || formValue.agentId || formValue.from || formValue.to);
    }

    private updateQueryParams(): void {
        const queryParams = {
            ...this.filtersForm.value,
            page: this.currentPage
        };

        // Limpiar parámetros vacíos
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
                delete queryParams[key];
            }
        });

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge'
        });
    }

    get paginationArray(): number[] {
        const pages = [];
        const maxVisible = 5;

        // Usar Math aquí está bien porque es dentro del TypeScript, no en el template
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }
}