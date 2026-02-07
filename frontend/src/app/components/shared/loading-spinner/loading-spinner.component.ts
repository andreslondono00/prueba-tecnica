import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrl: './loading-spinner.component.css',
    standalone: true,
    imports: [CommonModule]
})
export class LoadingSpinnerComponent {
    @Input() loading = false;
    @Input() message?: string;
}