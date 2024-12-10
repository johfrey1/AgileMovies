import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";

const useMovies = (endpoint) => {
  const [data, setData] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(endpoint);
        setData(response.data.data || response.data);
        setImageBaseUrl(response.data.imageBaseUrl || "");
      } catch (err) {
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, imageBaseUrl, loading, error };
};

export default useMovies;
