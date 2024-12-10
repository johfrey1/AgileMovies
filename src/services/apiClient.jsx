import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://161.35.140.236:9005/api",
});

// Añadir token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores y renovación del token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refresh_token");

      // Intentar renovar el token si tenemos un refresh_token
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://161.35.140.236:9005/api/auth/refresh",
            {
              refresh_token: refreshToken,
            }
          );
          const newToken = response.data.payload.token;

          // Actualizar token en localStorage
          localStorage.setItem("token", newToken);

          // Reintentar la solicitud original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (err) {
          console.error("Error al renovar el token", err);
          localStorage.clear();
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
