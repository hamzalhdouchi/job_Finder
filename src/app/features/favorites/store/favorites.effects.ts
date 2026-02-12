import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import { FavoritesService } from '../../../core/services/favorites.service';
import * as FavoritesActions from './favorites.actions';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private favoritesService = inject(FavoritesService);

  loadFavorites$ = createEffect(() => this.actions$.pipe(
    ofType(FavoritesActions.loadFavorites),
    switchMap(() => this.favoritesService.loadFavorites().pipe(
      map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
      catchError(error => of(FavoritesActions.loadFavoritesFailure({
        error: error.message || 'Failed to load favorites'
      })))
    ))
  ));

  addFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(FavoritesActions.addFavorite),
    exhaustMap(({ offer }) => this.favoritesService.addFavorite(offer).pipe(
      map(favorite => FavoritesActions.addFavoriteSuccess({ favorite })),
      catchError(error => of(FavoritesActions.addFavoriteFailure({
        error: error.message || 'Failed to add to favorites'
      })))
    ))
  ));

  removeFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(FavoritesActions.removeFavorite),
    exhaustMap(({ id }) => this.favoritesService.removeFavorite(id).pipe(
      map(() => FavoritesActions.removeFavoriteSuccess({ id })),
      catchError(error => of(FavoritesActions.removeFavoriteFailure({
        error: error.message || 'Failed to remove from favorites'
      })))
    ))
  ));

  updateNotes$ = createEffect(() => this.actions$.pipe(
    ofType(FavoritesActions.updateFavoriteNotes),
    exhaustMap(({ id, notes }) => this.favoritesService.updateNotes(id, notes).pipe(
      map(() => FavoritesActions.updateFavoriteNotesSuccess({ id, notes })),
      catchError(error => of(FavoritesActions.updateFavoriteNotesFailure({
        error: error.message || 'Failed to update notes'
      })))
    ))
  ));
}
