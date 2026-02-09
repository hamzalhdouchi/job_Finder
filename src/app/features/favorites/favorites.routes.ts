import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { favoritesReducer } from './store/favorites.reducer';

export const favoritesRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState({ name: 'favorites', reducer: favoritesReducer })
        ],
        children: []
    }
];
