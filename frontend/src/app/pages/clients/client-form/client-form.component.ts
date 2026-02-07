import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';
import { CreateClientRequest } from '../../../core/models/client.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-client-form',
    templateUrl: './client-form.component.html',
    styleUrls: ['./client-form.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule]
})
export class ClientFormComponent {
    clientForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private clientsService: ClientsService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.clientForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.clientForm.invalid) {
            this.markFormGroupTouched(this.clientForm);
            return;
        }

        this.isLoading = true;
        const clientData: CreateClientRequest = this.clientForm.value;

        this.clientsService.createClient(clientData).subscribe({
            next: (response) => {
                this.toastr.success('Client created successfully');
                this.router.navigate(['/clients', response.data.id]);
            },
            error: (error) => {
                this.toastr.error(error.message || 'Failed to create client');
                console.error(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/clients']);
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    get name() { return this.clientForm.get('name'); }
    get email() { return this.clientForm.get('email'); }

}