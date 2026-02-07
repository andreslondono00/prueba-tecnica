import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';
import { Client } from '../../../core/models/client.model';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessageComponent } from '../../../components/shared/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.css'],
    standalone: true,
    imports: [ErrorMessageComponent, LoadingSpinnerComponent, CommonModule, FormsModule]
})
export class ClientListComponent implements OnInit {
    clients: Client[] = [];
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    totalPages = 0;
    isLoading = false;
    searchTerm = '';

    // Añadir esta propiedad
    errorMessage?: string;

    constructor(
        private clientsService: ClientsService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loadClients();
    }

    loadClients(): void {
        this.isLoading = true;
        this.errorMessage = undefined; // Limpiar error anterior

        this.clientsService.getClients(this.currentPage, this.pageSize).subscribe({
            next: (response) => {
                this.clients = response.data;
                this.totalItems = response.pagination?.total || 0;
                this.totalPages = response.pagination?.totalPages || 0;
            },
            error: (error) => {
                this.errorMessage = error.message || 'Failed to load clients';
                this.toastr.error(this.errorMessage);
                console.error(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    viewClient(id: number): void {
        this.router.navigate(['/clients', id]);
    }

    createClient(): void {
        this.router.navigate(['/clients/new']);
    }

    searchClients(): void {
        if (this.searchTerm.trim()) {
            this.isLoading = true;
            this.errorMessage = undefined;

            this.clientsService.searchClients(this.searchTerm).subscribe({
                next: (response) => {
                    this.clients = response.data;
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
            this.loadClients();
        }
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadClients();
    }

    // Método para obtener el mínimo de dos números
    min(a: number, b: number): number {
        return a < b ? a : b;
    }

    // Método para calcular el texto de paginación
    getPaginationText(): string {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = this.min(this.currentPage * this.pageSize, this.totalItems);
        return `Showing ${start} to ${end} of ${this.totalItems} clients`;
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