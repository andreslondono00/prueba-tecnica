import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgentsService } from '../../../core/services/agents.service';
import { Agent } from '../../../core/models/agent.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../components/shared/error-message/error-message.component';

@Component({
    selector: 'app-agent-list',
    templateUrl: './agent-list.component.html',
    styleUrls: ['./agent-list.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ErrorMessageComponent]
})
export class AgentListComponent implements OnInit {
    agents: Agent[] = [];
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    totalPages = 0;
    isLoading = false;
    searchTerm = '';

    // Añadir esta propiedad
    errorMessage?: string;

    constructor(
        private agentsService: AgentsService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loadAgents();
    }

    loadAgents(): void {
        this.isLoading = true;
        this.errorMessage = undefined;

        this.agentsService.getAgents(this.currentPage, this.pageSize).subscribe({
            next: (response) => {
                this.agents = response.data;
                this.totalItems = response.pagination?.total || 0;
                this.totalPages = response.pagination?.totalPages || 0;
            },
            error: (error) => {
                this.errorMessage = error.message || 'Failed to load agents';
                this.toastr.error(this.errorMessage);
                console.error(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    viewAgent(id: number): void {
        this.router.navigate(['/agents', id]);
    }

    createAgent(): void {
        this.router.navigate(['/agents/new']);
    }

    searchAgents(): void {
        if (this.searchTerm.trim()) {
            this.isLoading = true;
            this.errorMessage = undefined;

            this.agentsService.searchAgents(this.searchTerm).subscribe({
                next: (response) => {
                    this.agents = response.data;
                    this.totalItems = response.data.length;
                    this.totalPages = 1;
                    this.currentPage = 1;
                },
                error: (error) => {
                    this.errorMessage = error.message || 'Search failed';
                    this.toastr.error(this.errorMessage);
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        } else {
            this.loadAgents();
        }
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadAgents();
    }

    getResolutionRate(agent: Agent): number {
        if (!agent.tickets_resolved || !agent.total_tickets || agent.total_tickets === 0) {
            return 0;
        }
        return Math.round((agent.tickets_resolved / agent.total_tickets) * 100);
    }

    // Método para obtener el mínimo de dos números
    min(a: number, b: number): number {
        return a < b ? a : b;
    }

    // Método para calcular el texto de paginación
    getPaginationText(): string {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = this.min(this.currentPage * this.pageSize, this.totalItems);
        return `Showing ${start} to ${end} of ${this.totalItems} agents`;
    }

    get paginationArray(): number[] {
        const pages = [];
        const maxVisible = 5;
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