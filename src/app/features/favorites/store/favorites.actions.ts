import { createAction, props } from '@ngrx/store';
import { FavoriteOffer } from '../../../core/services/favorites.service';

export const loadFavorites = createAction('[Favorites] Load Favorites');
export const loadFavoritesSuccess = createAction('[Favorites] Load Favorites Success', props<{ favorites: FavoriteOffer[] }>());
export const loadFavoritesFailure = createAction('[Favorites] Load Favorites Failure', props<{ error: string }>());

export const addFavorite = createAction('[Favorites] Add Favorite', props<{ offer: Omit<FavoriteOffer, 'id' | 'userId' | 'savedAt'> }>());
export const addFavoriteSuccess = createAction('[Favorites] Add Favorite Success', props<{ favorite: FavoriteOffer }>());
export const addFavoriteFailure = createAction('[Favorites] Add Favorite Failure', props<{ error: string }>());

export const removeFavorite = createAction('[Favorites] Remove Favorite', props<{ id: number }>());
export const removeFavoriteSuccess = createAction('[Favorites] Remove Favorite Success', props<{ id: number }>());
export const removeFavoriteFailure = createAction('[Favorites] Remove Favorite Failure', props<{ error: string }>());

export const updateFavoriteNotes = createAction('[Favorites] Update Notes', props<{ id: number; notes: string }>());
export const updateFavoriteNotesSuccess = createAction('[Favorites] Update Notes Success', props<{ id: number; notes: string }>());
export const updateFavoriteNotesFailure = createAction('[Favorites] Update Notes Failure', props<{ error: string }>());

export const clearFavoritesError = createAction('[Favorites] Clear Error');
