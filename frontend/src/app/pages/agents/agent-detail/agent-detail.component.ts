import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentsService } from '../../../core/services/agents.service';
import { TicketsService } from '../../../core/services/tickets.service';
import { Agent, UpdateAgentRequest } from '../../../core/models/agent.model';
import { Ticket } from '../../../core/models/ticket.model';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-agent-detail',
    templateUrl: './agent-detail.component.html',
    styleUrls: ['./agent-detail.component.css'],
    standalone: true,
    imports: [LoadingSpinnerComponent, CommonModule, ReactiveFormsModule]
})
export class AgentDetailComponent implements OnInit {
    agent: Agent | null = null;
    tickets: Ticket[] = [];
    isLoading = false;
    isEditing = false;
    isSaving = false;

    agentForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private agentsService: AgentsService,
        private ticketsService: TicketsService,
        private toastr: ToastrService
    ) {
        this.agentForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadAgent(parseInt(id));
        }
    }

    loadAgent(id: number): void {
        this.isLoading = true;
        this.agentsService.getAgent(id).subscribe({
            next: (response) => {
                this.agent = response.data;
                this.loadAgentTickets(id);
                this.agentForm.patchValue({
                    name: this.agent.name,
                    email: this.agent.email
                });
            },
            error: (error) => {
                this.toastr.error('Failed to load agent');
                this.router.navigate(['/agents']);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    loadAgentTickets(agentId: number): void {
        this.ticketsService.getTickets({ agentId }).subscribe({
            next: (response) => {
                this.tickets = response.data;
            },
            error: (error) => {
                console.error('Failed to load agent tickets:', error);
            }
        });
    }

    startEdit(): void {
        this.isEditing = true;
    }

    cancelEdit(): void {
        this.isEditing = false;
        if (this.agent) {
            this.agentForm.patchValue({
                name: this.agent.name,
                email: this.agent.email
            });
        }
    }

    saveAgent(): void {
        if (this.agentForm.invalid || !this.agent) return;

        this.isSaving = true;
        const updateData: UpdateAgentRequest = this.agentForm.value;

        this.agentsService.updateAgent(this.agent.id, updateData).subscribe({
            next: (response) => {
                this.agent = response.data;
                this.isEditing = false;
                this.toastr.success('Agent updated successfully');
            },
            error: (error) => {
                this.toastr.error('Failed to update agent');
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

    getResolutionRate(): number {
        if (!this.agent?.tickets_resolved || !this.agent?.total_tickets || this.agent.total_tickets === 0) {
            return 0;
        }
        return Math.round((this.agent.tickets_resolved / this.agent.total_tickets) * 100);
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
        this.router.navigate(['/agents']);
    }
}