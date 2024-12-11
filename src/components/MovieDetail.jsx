import React, { useEffect, useState, Suspense, lazy } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

// Componentes secundarios
const Header = () => (
  <header className="flex justify-between items-center p-4 bg-gray-100">
    <h1 className="text-xl font-bold">AgileMovies</h1>
    <div className="flex items-center gap-2">
      <span>
        Hola, <strong>Nombre Apellido</strong>
      </span>
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
    </div>
  </header>
);

const MovieDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { nowPlaying = [], popular = [] } = state || {};

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);

        // Buscar película en las listas proporcionadas
        const allMovies = [...nowPlaying, ...popular];
        const selectedMovie = allMovies.find(
          (movie) => movie.id === parseInt(id)
        );

        if (!selectedMovie) {
          throw new Error("Película no encontrada.");
        }

        setMovie(selectedMovie);

        // Obtener datos del reparto
        const castResponse = await axios.get(
          `http://161.35.140.236:9005/api/movies/${id}/actors`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setCast(
          Array.isArray(castResponse.data.data) ? castResponse.data.data : []
        );
      } catch (err) {
        setError(err.message || "Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, nowPlaying, popular]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>Película no encontrada.</div>;

  return (
    <div className="movie-detail">
      <Header />

      {/* Información principal */}
      <div className="flex flex-col md:flex-row p-4 gap-4">
        {/* Imagen principal */}
        <div className="relative">
          <img
            src={`${imageBaseUrl}${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster rounded-lg shadow-md"
            loading="lazy" // Lazy loading para la imagen principal
          />
          {cast.length > 0 && cast[0].profile_path && (
            <img
              src={`${imageBaseUrl}${cast[0].profile_path}`}
              alt="Actor destacado"
              className="absolute top-4 left-4 w-24 h-24 rounded-full border-4 border-white shadow-lg"
              loading="lazy" // Lazy loading para imagen del actor destacado
            />
          )}
        </div>

        {/* Detalles de la película */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold">{movie.title}</h2>
          <p className="text-gray-700 mt-4">{movie.overview}</p>
        </div>
      </div>

      {/* Reparto */}
      <div className="movie-cast p-4">
        <h2 className="text-2xl font-bold mb-4">Reparto</h2>
        <div
          className="flex overflow-x-auto gap-4 pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {cast.length > 0 ? (
            cast.map((actor) => (
              <div
                key={actor.id}
                className="actor-card flex-shrink-0 w-48 text-center"
                style={{ scrollSnapAlign: "start" }}
              >
                <img
                  src={
                    actor.profile_path
                      ? `${imageBaseUrl}${actor.profile_path}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={actor.name}
                  className="actor-image w-full h-64 object-cover rounded-md shadow-md"
                  loading="lazy" // Lazy loading para imágenes del reparto
                />
                <p className="actor-name font-bold mt-2">{actor.name}</p>
                <p className="actor-character text-gray-500 text-sm">
                  {actor.character || "Personaje no especificado"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">
              No se encontró información del reparto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
