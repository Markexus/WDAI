import "./SearchBar.css";

function SearchBar({ setSearchValue }) {
    return (
        <div className="search-bar">
            <h3>Wyszukiwarka</h3>
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button>Szukaj</button>
        </div>
    );
}

export default SearchBar;
