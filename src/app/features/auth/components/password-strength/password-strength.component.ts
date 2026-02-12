import { Component, input } from '@angular/core';

export interface PasswordStrengthState {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
}

@Component({
    selector: 'app-password-strength',
    standalone: true,
    templateUrl: './password-strength.component.html'
})
export class PasswordStrengthComponent {
    strength = input.required<PasswordStrengthState>();

    get strengthPercentage(): number {
        const s = this.strength();
        const checks = [s.hasMinLength, s.hasUppercase, s.hasLowercase, s.hasNumber, s.hasSpecial];
        return (checks.filter(Boolean).length / checks.length) * 100;
    }

    get strengthLabel(): string {
        const percentage = this.strengthPercentage;
        if (percentage <= 20) return 'Very Weak';
        if (percentage <= 40) return 'Weak';
        if (percentage <= 60) return 'Fair';
        if (percentage <= 80) return 'Good';
        return 'Strong';
    }

    get strengthColor(): string {
        const percentage = this.strengthPercentage;
        if (percentage <= 20) return 'bg-red-500';
        if (percentage <= 40) return 'bg-orange-500';
        if (percentage <= 60) return 'bg-yellow-500';
        if (percentage <= 80) return 'bg-lime-500';
        return 'bg-green-600';
    }
}
