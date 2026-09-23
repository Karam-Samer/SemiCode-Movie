# SemiCode-Movie

CineVerse is a movie discovery web application built using HTML, CSS (Sass), and JavaScript (jQuery). The application relies on **The Movie Database (TMDB) API** to fetch data about movies, trailers, and cast members.

## API Documentation

This project uses [TMDB API v3](https://developer.themoviedb.org/reference/intro/getting-started) to populate the frontend with dynamic movie data.

### Authentication
All requests to the TMDB API require authentication via a **Bearer Token** passed in the `Authorization` header.
```javascript
headers: {
    accept: 'application/json',
    Authorization: 'Bearer YOUR_TMDB_API_KEY_HERE'
}
```
*(Note: A valid TMDB API Read Access Token must be provided in the JavaScript configuration for the application to function correctly).*

---

### Endpoints Used

#### 1. Discover Movies (By Genre)
Fetches a paginated list of movies based on specific genres.
- **Endpoint:** `GET https://api.themoviedb.org/3/discover/movie`
- **Parameters:**
  - `page`: The page number to fetch.
  - `with_genres`: The genre ID to include.
  - `without_genres`: Exclude other genres to strictly match the requested type.
  - `include_adult`: `false` (Safe filter enabled).
  - `vote_count.gte`: `50` (Ensures only movies with a minimum number of ratings are shown).
- **Usage in App:** Used in the "Movies" section tabs to load Action, Comedy, Drama, etc.

#### 2. Search Movies
Searches for movies by title or keyword.
- **Endpoint:** `GET https://api.themoviedb.org/3/search/movie`
- **Parameters:**
  - `query`: The user's search string.
  - `page`: The page number.
  - `include_adult`: `false`.
  - `language`: `en-US`.
- **Usage in App:** Powers the live search bar and the search results popup.

#### 3. Trending Movies
Fetches the daily trending movies list.
- **Endpoint:** `GET https://api.themoviedb.org/3/trending/movie/day`
- **Parameters:**
  - `language`: `en-US`.
- **Usage in App:** Populates the "Trending Movies" carousel and is used as a safe fallback for the Hero section.

#### 4. Movie Trailers (Videos)
Fetches associated videos (trailers, teasers) for a specific movie.
- **Endpoint:** `GET https://api.themoviedb.org/3/movie/{movie_id}/videos`
- **Parameters:**
  - `movie_id`: The ID of the specific movie.
  - `language`: `en-US`.
- **Usage in App:** Filters the results to find a "YouTube" video of type "Trailer" or "Teaser" to play inside the Movie Details popup.

#### 5. Movie Cast (Credits)
Fetches the cast and crew for a specific movie.
- **Endpoint:** `GET https://api.themoviedb.org/3/movie/{movie_id}/credits`
- **Parameters:**
  - `movie_id`: The ID of the specific movie.
  - `language`: `en-US`.
- **Usage in App:** Extracts the top 6 cast members to display their images and names in the Movie Details popup.
