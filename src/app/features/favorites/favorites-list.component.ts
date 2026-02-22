import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FavoriteOffer } from '../../core/services/favorites.service';
import { FavoriteCardComponent } from './components/favorite-card/favorite-card.component';
import * as FavoritesActions from './store/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading, selectFavoritesError } from './store/favorites.selectors';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, FavoriteCardComponent],
  templateUrl: './favorites-list.component.html'
})
export class FavoritesListComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);

  favorites$: Observable<FavoriteOffer[]> = this.store.select(selectAllFavorites);
  loading$: Observable<boolean> = this.store.select(selectFavoritesLoading);
  error$: Observable<string | null> = this.store.select(selectFavoritesError);

  // Pagination
  currentPage = signal(1);
  itemsPerPage = 6;
  allFavorites = signal<FavoriteOffer[]>([]);

  totalPages = computed(() => Math.ceil(this.allFavorites().length / this.itemsPerPage) || 1);

  paginatedFavorites = (() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.allFavorites().slice(start, start + this.itemsPerPage);
  });

  pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  ngOnInit(): void {
    this.store.dispatch(FavoritesActions.loadFavorites());
    this.favorites$.subscribe(favs => {
      this.allFavorites.set(favs);
      if (this.currentPage() > this.totalPages()) {
        this.currentPage.set(Math.max(1, this.totalPages()));
      }
    });
  }

  ngOnDestroy(): void {}

  onRemoveFavorite(id: number): void {
    this.store.dispatch(FavoritesActions.removeFavorite({ id }));
  }

  onNotesChange(event: { id: number; notes: string }): void {
    this.store.dispatch(FavoritesActions.updateFavoriteNotes(event));
  }

  dismissError(): void {
    this.store.dispatch(FavoritesActions.clearFavoritesError());
  }

  onTrackApplication(favorite: FavoriteOffer): void {
    this.router.navigate(['/applications'], {
      queryParams: {
        addOfferId: favorite.offerId,
        title: favorite.title,
        company: favorite.company,
        location: favorite.location
      }
    });
  }

  goToSearch(): void {
    this.router.navigate(['/jobs']);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  trackById(index: number, fav: FavoriteOffer): number {
    return fav.id!;
  }
}
