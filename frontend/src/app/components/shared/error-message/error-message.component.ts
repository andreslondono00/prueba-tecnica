import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
    styleUrl: './error-message.component.css',
    standalone: true,
    imports: [CommonModule]
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