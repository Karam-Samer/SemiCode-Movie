function fetchMovies(Type, page, callback) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://api.themoviedb.org/3/discover/movie`,
        data: {
            page: page,
            with_genres: Type,
            without_genres: GenresNames.filter(genre => genre !== Type).join(','),
            include_adult: false,
            'vote_count.gte': 50
        },
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTdlNWQzOWU4Yjc2ZTVkNzBiMGFiNDI0MGNjODBlYSIsIm5iZiI6MTc4NDM0MTg1MS40NzQsInN1YiI6IjZhNWFlNTViOWRmMDg0N2NmMzQ4ZTRiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hmmDn0kEacv8qJZX_bssaMfDPdHAyF_e62mwqwybv-A'
        },
        success: function (response) {
            let genreName = GenresId[Type];

            MoviesALL[genreName] = response.results;
            NumberOfPages[Type] = response.total_pages;

            callback(response);
        },
        error: function (err) {
            console.error("Error fetching movies:", err);
        }
    };

    $.ajax(settings);
}


function fetchMoviesBySearch(query, page, callback) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://api.themoviedb.org/3/search/movie`,
        data: {
            query: query,
            page: page,
            include_adult: false,
            language: 'en-US'
        },
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTdlNWQzOWU4Yjc2ZTVkNzBiMGFiNDI0MGNjODBlYSIsIm5iZiI6MTc4NDM0MTg1MS40NzQsInN1YiI6IjZhNWFlNTViOWRmMDg0N2NmMzQ4ZTRiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hmmDn0kEacv8qJZX_bssaMfDPdHAyF_e62mwqwybv-A'
        },
        success: function (response) {
            callback(response);
        },
        error: function (err) {
            console.error("Error fetching search results:", err);
        }
    };

    $.ajax(settings);
}

function trendingMovies(callback) {
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://api.themoviedb.org/3/trending/movie/day?language=en-US',
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTdlNWQzOWU4Yjc2ZTVkNzBiMGFiNDI0MGNjODBlYSIsIm5iZiI6MTc4NDM0MTg1MS40NzQsInN1YiI6IjZhNWFlNTViOWRmMDg0N2NmMzQ4ZTRiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hmmDn0kEacv8qJZX_bssaMfDPdHAyF_e62mwqwybv-A'
        },
        success: function (response) {
            MoviesALL.Trending = response.results;
            callback(response);
        },
        error: function (err) {
            console.error("Error fetching trending movies:", err);
        }
    };

    $.ajax(settings);
}

function fetchMovieTrailer(movieId, callback) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTdlNWQzOWU4Yjc2ZTVkNzBiMGFiNDI0MGNjODBlYSIsIm5iZiI6MTc4NDM0MTg1MS40NzQsInN1YiI6IjZhNWFlNTViOWRmMDg0N2NmMzQ4ZTRiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hmmDn0kEacv8qJZX_bssaMfDPdHAyF_e62mwqwybv-A'
        },
        success: function (data) {
            let videos = data.results || [];
            let trailer = videos.find(vid => vid.site === "YouTube" && vid.type === "Trailer")
                || videos.find(vid => vid.site === "YouTube" && vid.type === "Teaser")
                || videos.find(vid => vid.site === "YouTube");
            callback(trailer ? trailer.key : null);
        },
        error: function (err) {
            console.error("Error fetching trailer via AJAX:", err);
            callback(null);
        }
    };

    $.ajax(settings);
}

function fetchMovieCast(movieId, callback) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTdlNWQzOWU4Yjc2ZTVkNzBiMGFiNDI0MGNjODBlYSIsIm5iZiI6MTc4NDM0MTg1MS40NzQsInN1YiI6IjZhNWFlNTViOWRmMDg0N2NmMzQ4ZTRiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hmmDn0kEacv8qJZX_bssaMfDPdHAyF_e62mwqwybv-A'
        },
        success: function (data) {
            let topCast = (data.cast || []).slice(0, 6);
            callback(topCast);
        },
        error: function (err) {
            console.error("Error fetching cast via AJAX:", err);
            callback([]);
        }
    };

    $.ajax(settings);
}