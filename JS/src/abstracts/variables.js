const GenresId = {
    "12": "Adventure",
    "14": "Fantasy",
    "16": "Animation",
    "18": "Drama",
    "27": "Horror",
    "28": "Action",
    "35": "Comedy",
    "36": "History",
    "37": "Western",
    "53": "Thriller",
    "80": "Crime",
    "99": "Documentary",
    "878": "Science Fiction",
    "9648": "Mystery",
    "10402": "Music",
    "10749": "Romance",
    "10751": "Family",
    "10752": "War",
    "10770": "TV Movie"
};

const MoviesALL = {
    Action: [],
    Comedy: [],
    Horror: [],
    Romance: [],
    Crime: [],
    Search: [],
    WatchList: [],
    Trending: []
},
    Regex = {
        UserName: /^[a-zA-Z0-9]{3,20}$/,
        Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        Password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    };

let searchInput = $("#Search"),
    searchBtn = $("#SearchBtn"),
    searchResults = $("#SearchResults");