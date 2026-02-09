# Architecture Overview

## Component Hierarchy & Data Flow

```mermaid
graph TD
    App[AppComponent] --> Router[Router-Outlet]
    
    subgraph Features [Lazy Loaded Modules]
        Router --> Auth[Auth Feature]
        Router --> Jobs[Jobs Feature]
        Router --> Favorites[Favorites Feature]
        Router --> Applications[Applications Feature]
        Router --> Profile[Profile Feature]
    end

    subgraph Core [Core Layer / Singleton]
        AuthGuard[Auth Guard]
        ErrorInt[Error Interceptor]
        ApiService[Api Service]
    end

    subgraph State [NgRx State]
        Store[Global Store]
        FavState[Favorites State]
        AuthState[Auth State]
    end

    AuthGuard -.-> Router
    ErrorInt -.-> ApiService
    
    Favorites -->|Dispatch Actions| FavState
    FavState -->|Select Data| Favorites
    
    ApiService <-->|HTTP Requests| Backend[JSON Server]
```

## Data Flow Strategy
1. **Components** dispatch Actions to the Store.
2. **Effects** listen for Actions, perform side effects (API calls via Services), and dispatch Success/Failure actions.
3. **Reducers** listen for Success/Failure actions and update the State.
4. **Selectors** query the State and return Observables to Components.
