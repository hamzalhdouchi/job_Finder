# API Integration Strategy

## 🎯 Objective
Integrate external Job APIs to provide real-world job listings alongside our internal logic.

## 🔗 Potential API Candidates

### 1. Adzuna API
- **Pros**: Global coverage, rich metadata, free tier available.
- **Cons**: Rate limits on free tier.
- **Integration**: `src/app/core/services/adzuna.service.ts`

### 2. The Muse API
- **Pros**: High-quality tech jobs, completely free, good documentation.
- **Cons**: US-centric.
- **Integration**: `src/app/core/services/muse.service.ts`

### 3. JSearch (RapidAPI)
- **Pros**: Scrapes multiple job boards (LinkedIn, Indeed, Glassdoor).
- **Cons**: Paid subscription required for high volume.
- **Integration**: `src/app/core/services/jsearch.service.ts`

## 🛠️ Integration Approach
1. **Adapter Pattern**: Create a `JobService` interface.
2. **Aggregator**: Implement a service that can fetch from multiple sources and normalize data into our `JobOffer` model.
3. **Caching**: Use NgRx to cache API responses to minimize rate limit usage.
4. **Proxy**: If CORS issues arise, proxy requests through our own backend (or similar middleware).
