import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import * as AuthActions from './core/store/auth/auth.actions';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.html',

})
export class App {
  protected readonly title = signal('JobFinder');
  private authService = inject(AuthService);
  private store = inject(Store);
  private router = inject(Router);

  showHeader$: Observable<boolean>;

  constructor() {
    const session = this.authService.getSession();
    if (session?.user) {
      this.store.dispatch(AuthActions.restoreSession({ user: session.user }));
    }

    const navEnd$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    this.showHeader$ = navEnd$.pipe(
      map((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        return !url.startsWith('/auth');
      })
    );
  }
}
