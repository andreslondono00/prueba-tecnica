import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    template: `
        <div class="loading-overlay" *ngIf="loading">
            <div class="spinner"></div>
            <div class="ms-3" *ngIf="message">{{ message }}</div>
        </div>
    `,
    styles: [`
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .spinner {
            width: 3rem;
            height: 3rem;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #0d6efd;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `]
})
export class LoadingSpinnerComponent {
    @Input() loading = false;
    @Input() message?: string;
}