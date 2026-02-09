import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-jobs-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Jobs</h2>
      <p class="text-gray-600">The job listing functionality will be implemented here.</p>
    </div>
  `
})
export class JobsListComponent { }
