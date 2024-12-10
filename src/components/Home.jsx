import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import useMovies from "../hooks/useMovies";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  if (errorNowPlaying || errorPopular)
    return (
      <div>Error al cargar las películas. Por favor, inténtalo más tarde.</div>
    );

  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      {/* Encabezado */}
      <header className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <h1 className="text-xl font-bold">AgileMovies</h1>
        <div className="flex items-center gap-2">
          <span>
            Hola, <strong>Nombre Apellido</strong>
          </span>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </header>

      <div className="p-4">
        {/* Sección de Películas en Estreno */}
        <h1 className="text-2xl font-bold mb-4">Películas en Estreno</h1>
        <Slider {...sliderSettings}>
          {nowPlaying.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              state={{ nowPlaying, popular, imageBaseUrl: baseNowPlaying }}
            >
              <div className="p-2">
                <img
                  src={`${baseNowPlaying}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-md shadow-md"
                />
                <h2 className="font-bold text-md mt-2 text-center">
                  {movie.title}
                </h2>
              </div>
            </Link>
          ))}
        </Slider>

        {/* Sección de Películas Populares */}
        <h1 className="text-2xl font-bold mt-8 mb-4">
          Películas más Populares
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popular.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              state={{ nowPlaying, popular, imageBaseUrl: basePopular }}
            >
              <div className="bg-gray-100 p-2 rounded-md shadow-md">
                <img
                  src={`${basePopular}${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-md w-full h-64 object-cover"
                />
                <h2 className="font-bold text-lg mt-2">{movie.title}</h2>
                <p className="text-sm">{movie.release_date}</p>
                <p className="text-xs text-gray-600">
                  {movie.overview || "Sin descripción disponible."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
