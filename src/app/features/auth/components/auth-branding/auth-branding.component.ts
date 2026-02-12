import { Component, input } from '@angular/core';

@Component({
    selector: 'app-auth-branding',
    standalone: true,
    styles: [`:host { display: contents; }`],
    templateUrl: './auth-branding.component.html'
})
export class AuthBrandingComponent {
    title = input.required<string>();
    subtitle = input.required<string>();
    description = input.required<string>();
    features = input<string[]>([]);
    stats = input<string[]>([]);
}
