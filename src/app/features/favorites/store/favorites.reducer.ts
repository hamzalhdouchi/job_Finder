import { createReducer, on } from '@ngrx/store';
import { FavoriteOffer } from '../../../core/services/favorites.service';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
  items: FavoriteOffer[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
  successMessage: null
};

export const favoritesReducer = createReducer(
  initialState,

  on(FavoritesActions.loadFavorites, state => ({ ...state, loading: true, error: null })),
  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    items: favorites,
    loading: false,
    error: null
  })),
  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(FavoritesActions.addFavorite, state => ({ ...state, error: null, successMessage: null })),
  on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    items: [...state.items, favorite],
    successMessage: 'Job added to favorites!'
  })),
  on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(FavoritesActions.removeFavorite, state => ({ ...state, error: null, successMessage: null })),
  on(FavoritesActions.removeFavoriteSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter(f => f.id !== id),
    successMessage: 'Job removed from favorites'
  })),
  on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(FavoritesActions.updateFavoriteNotes, state => ({ ...state, error: null })),
  on(FavoritesActions.updateFavoriteNotesSuccess, (state, { id, notes }) => ({
    ...state,
    items: state.items.map(f => f.id === id ? { ...f, notes } : f)
  })),
  on(FavoritesActions.updateFavoriteNotesFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(FavoritesActions.clearFavoritesError, state => ({
    ...state,
    error: null,
    successMessage: null
  }))
);
