import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from '../../../core/services/tickets.service';
import { AgentsService } from '../../../core/services/agents.service';
import { Ticket, TicketStatus } from '../../../core/models/ticket.model';
import { Agent } from '../../../core/models/agent.model';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ticket-detail',
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, LoadingSpinnerComponent, CommonModule]
})
export class TicketDetailComponent implements OnInit {
    ticket: Ticket | null = null;
    agents: Agent[] = [];
    isLoading = false;
    isUpdating = false;
    
    assignForm: FormGroup;
    statusForm: FormGroup;
    
    readonly statusOptions = Object.values(TicketStatus);
    readonly statusLabels: Record<TicketStatus, string> = {
        [TicketStatus.OPEN]: 'Open',
        [TicketStatus.IN_PROGRESS]: 'In Progress',
        [TicketStatus.RESOLVED]: 'Resolved'
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private ticketsService: TicketsService,
        private agentsService: AgentsService,
        private toastr: ToastrService
    ) {
        this.assignForm = this.fb.group({
            agentId: ['', Validators.required]
        });

        this.statusForm = this.fb.group({
            status: ['', Validators.required],
            resolution: ['']
        });
    }

    ngOnInit(): void {
        const ticketId = this.route.snapshot.paramMap.get('id');
        if (ticketId) {
            this.loadTicket(parseInt(ticketId));
            this.loadAgents();
        }
    }

    loadTicket(id: number): void {
        this.isLoading = true;
        this.ticketsService.getTicket(id).subscribe({
            next: (response) => {
                this.ticket = response.data;
                this.updateForms();
            },
            error: (error) => {
                this.toastr.error('Failed to load ticket');
                this.router.navigate(['/tickets']);
            },
            complete: () => {
                this.isLoading = false;
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

    updateForms(): void {
        if (this.ticket) {
            this.assignForm.patchValue({
                agentId: this.ticket.agent_id || ''
            });

            this.statusForm.patchValue({
                status: this.ticket.status,
                resolution: this.ticket.resolution || ''
            });
        }
    }

    assignAgent(): void {
        if (this.assignForm.invalid || !this.ticket) return;

        this.isUpdating = true;
        const agentId = this.assignForm.value.agentId;

        this.ticketsService.assignAgent(this.ticket.id, agentId).subscribe({
            next: (response) => {
                this.ticket = response.data;
                this.toastr.success('Agent assigned successfully');
                this.assignForm.reset();
                this.updateForms();
            },
            error: (error) => {
                this.toastr.error(error.message || 'Failed to assign agent');
            },
            complete: () => {
                this.isUpdating = false;
            }
        });
    }

    updateStatus(): void {
        if (this.statusForm.invalid || !this.ticket) return;

        this.isUpdating = true;
        const { status, resolution } = this.statusForm.value;

        this.ticketsService.updateStatus(this.ticket.id, status, resolution).subscribe({
            next: (response) => {
                this.ticket = response.data;
                this.toastr.success('Status updated successfully');
                this.updateForms();
            },
            error: (error) => {
                this.toastr.error(error.message || 'Failed to update status');
            },
            complete: () => {
                this.isUpdating = false;
            }
        });
    }

    getStatusClass(status: TicketStatus): string {
        switch (status) {
            case TicketStatus.OPEN: return 'status-badge status-open';
            case TicketStatus.IN_PROGRESS: return 'status-badge status-in-progress';
            case TicketStatus.RESOLVED: return 'status-badge status-resolved';
            default: return 'status-badge';
        }
    }

    canChangeStatus(): boolean {
        if (!this.ticket) return false;
        return this.ticket.status !== TicketStatus.RESOLVED;
    }

    showResolutionField(): boolean {
        return this.statusForm.get('status')?.value === TicketStatus.RESOLVED;
    }

    // Añadir esta función
    goBack(): void {
        this.router.navigate(['/tickets']);
    }
}