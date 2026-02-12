import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.items
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.error
);

export const selectFavoritesSuccess = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.successMessage
);

export const selectIsFavorite = (offerId: string) => createSelector(
  selectAllFavorites,
  (favorites) => favorites.some(f => f.offerId === offerId)
);

export const selectFavoriteByOfferId = (offerId: string) => createSelector(
  selectAllFavorites,
  (favorites) => favorites.find(f => f.offerId === offerId) ?? null
);

export const selectFavoritesCount = createSelector(
  selectAllFavorites,
  (favorites) => favorites.length
);
