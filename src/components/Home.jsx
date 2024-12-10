import useMovies from "../hooks/useMovies";

const Home = () => {
  const {
    data: nowPlaying,
    imageBaseUrl: baseNowPlaying,
    loading: loadingNowPlaying,
    error: errorNowPlaying,
  } = useMovies("/movies/now_playing");
  const {
    data: popular,
    imageBaseUrl: basePopular,
    loading: loadingPopular,
    error: errorPopular,
  } = useMovies("/movies/popular");

  if (loadingNowPlaying || loadingPopular) return <div>Cargando...</div>;

  if (errorNowPlaying || errorPopular) {
    return (
      <div>Error al cargar las películas. Por favor, inténtalo más tarde.</div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Películas en Estreno</h1>
      <div className="grid grid-cols-4 gap-4">
        {nowPlaying.length > 0 ? (
          nowPlaying.map((movie) => (
            <div key={movie.id} className="bg-gray-100 p-2 rounded-md">
              <img
                src={`${baseNowPlaying}${movie.poster_path}`}
                alt={movie.title}
                className="rounded-md"
              />
              <h2 className="font-bold text-lg mt-2">{movie.title}</h2>
              <p className="text-sm">{movie.release_date}</p>
              <p className="text-xs text-gray-600">
                {movie.overview || "Sin descripción disponible."}
              </p>
            </div>
          ))
        ) : (
          <p>No hay películas en estreno disponibles.</p>
        )}
      </div>

      <h1 className="text-2xl font-bold mt-8 mb-4">Películas Populares</h1>
      <div className="grid grid-cols-4 gap-4">
        {popular.length > 0 ? (
          popular.map((movie) => (
            <div key={movie.id} className="bg-gray-100 p-2 rounded-md">
              <img
                src={`${basePopular}${movie.poster_path}`}
                alt={movie.title}
                className="rounded-md"
              />
              <h2 className="font-bold text-lg mt-2">{movie.title}</h2>
              <p className="text-sm">{movie.release_date}</p>
              <p className="text-xs text-gray-600">
                {movie.overview || "Sin descripción disponible."}
              </p>
            </div>
          ))
        ) : (
          <p>No hay películas populares disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
