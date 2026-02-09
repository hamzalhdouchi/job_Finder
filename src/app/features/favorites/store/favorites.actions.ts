import { createAction, props } from '@ngrx/store';

export const loadFavorites = createAction('[Favorites] Load Favorites');
export const loadFavoritesSuccess = createAction(
    '[Favorites] Load Favorites Success',
    props<{ favorites: any[] }>()
);
export const loadFavoritesFailure = createAction(
    '[Favorites] Load Favorites Failure',
    props<{ error: any }>()
);
