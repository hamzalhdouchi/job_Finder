import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-danger-zone',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './danger-zone.component.html'
})
export class DangerZoneComponent {
    loading = input(false);
    deleteAccount = output<void>();

    showDeleteConfirm = false;
    deleteConfirmText = '';

    toggleDeleteConfirm(): void {
        this.showDeleteConfirm = !this.showDeleteConfirm;
        this.deleteConfirmText = '';
    }

    onDelete(): void {
        if (this.deleteConfirmText === 'DELETE') {
            this.deleteAccount.emit();
        }
    }
}
