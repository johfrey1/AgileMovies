import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import useMovies from "../hooks/useMovies";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const { data: nowPlaying } = useMovies("/movies/now_playing");
  const { data: popular } = useMovies("/movies/popular");
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const allMovies = [...nowPlaying, ...popular];
        const selectedMovie = allMovies.find(
          (movie) => movie.id === parseInt(id)
        );
        if (!selectedMovie) throw new Error("Película no encontrada.");

        setMovie(selectedMovie);
        setImageBaseUrl("https://image.tmdb.org/t/p/w500");

        const response = await apiClient.get(`/movies/${id}/actors`);
        setCast(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, nowPlaying, popular]);

  if (loading) return <div>Cargando detalles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="flex">
        <img
          src={`${imageBaseUrl}${movie.poster_path}`}
          alt={movie.title}
          className="w-1/3 rounded-md"
        />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-600 mt-2">{movie.release_date}</p>
          <p className="mt-4">
            {movie.overview || "Sin descripción disponible."}
          </p>
          <p className="mt-2">
            <strong>Votos:</strong> {movie.vote_average} ({movie.vote_count}{" "}
            votos)
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8">Reparto</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {cast.map((actor) => (
          <div key={actor.id} className="text-center">
            <img
              src={
                actor.profile_path
                  ? `${imageBaseUrl}${actor.profile_path}`
                  : "https://via.placeholder.com/150"
              }
              alt={actor.name}
              className="rounded-md w-32 h-48 mx-auto"
            />
            <p className="font-bold mt-2">{actor.name}</p>
            <p className="text-sm text-gray-600">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetail;
