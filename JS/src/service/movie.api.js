
function fetchMovies(Type, page, callback) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://api.themoviedb.org/3/discover/movie`,
        data: {
            page: page,
            with_genres: Type,
            without_genres: GenresNames.filter(genre => genre !== Type).join(',')
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
            console.error(err);
        }
    };
    $.ajax(settings).done(res => {
        console.log(res);
    });
}


function fetchMoviesBySearch(query, page, callback) {
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTdlNWQzOWU4Yjc2ZTVkNzBiMGFiNDI0MGNjODBlYSIsIm5iZiI6MTc4NDM0MTg1MS40NzQsInN1YiI6IjZhNWFlNTViOWRmMDg0N2NmMzQ4ZTRiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hmmDn0kEacv8qJZX_bssaMfDPdHAyF_e62mwqwybv-A' }
    };

    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`, options)
        .then(res => res.json())
        .then(res => callback(res))
        .catch(err => console.error(err));
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
            console.error(err);
        }
    };

    $.ajax(settings).done(res => {
        console.log(res);
    });
}