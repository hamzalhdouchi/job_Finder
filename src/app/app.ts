import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from './core/services/auth.service';
import * as AuthActions from './core/store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('JobFinder');
  private authService = inject(AuthService);
  private store = inject(Store);

  constructor() {
    const user = this.authService.getSession();
    if (user) {
      this.store.dispatch(AuthActions.restoreSession({ user }));
    }
  }
}
