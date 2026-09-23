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

const customSwal = swal.mixin({
    background: "#0F172A",
    color: "#F8FAFC",
    backdrop: "rgba(8, 11, 19, 0.8)",
    showCloseButton: true,
    buttonsStyling: false,
    customClass: {
        popup: "rounded-4 border border-secondary shadow-lg p-3",
        title: "fw-bold fs-4 text-white",
        confirmButton: "btn btn-primary px-4 py-2 rounded-pill mx-1 fw-semibold",
        cancelButton: "btn btn-outline-light px-4 py-2 rounded-pill mx-1 fw-semibold"
    }
});