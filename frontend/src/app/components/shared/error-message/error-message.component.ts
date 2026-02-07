import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-error-message',
    template: `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" *ngIf="message">
            <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>
                    <strong *ngIf="title">{{ title }}</strong>
                    <div>{{ message }}</div>
                </div>
            </div>
            <button type="button" class="btn-close" 
                    (click)="onDismiss()" 
                    *ngIf="dismissible"
                    aria-label="Close"></button>
        </div>
    `,
    styles: [`
        .alert {
            border-radius: 0.375rem;
            border: 1px solid #f5c2c7;
            background-color: #f8d7da;
            color: #842029;
        }
        
        .alert .btn-close {
            padding: 1.25rem 1rem;
        }
        
        .alert i {
            font-size: 1.25rem;
        }
    `]
})
export class ErrorMessageComponent {
    @Input() message?: string;
    @Input() title?: string;
    @Input() dismissible = false;

    @Output() dismiss = new EventEmitter<void>();

    onDismiss(): void {
        this.dismiss.emit();
    }
}