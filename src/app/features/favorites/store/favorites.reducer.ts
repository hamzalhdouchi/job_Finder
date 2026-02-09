import { createReducer, on } from '@ngrx/store';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
    items: any[];
    loading: boolean;
    error: any;
}

export const initialState: FavoritesState = {
    items: [],
    loading: false,
    error: null
};

export const favoritesReducer = createReducer(
    initialState,
    on(FavoritesActions.loadFavorites, state => ({ ...state, loading: true })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
        ...state,
        items: favorites,
        loading: false
    })),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);
