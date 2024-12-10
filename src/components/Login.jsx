import { useState } from "react";
import apiClient from "../services/apiClient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      // Acceder correctamente a payload y user desde response.data.data
      const { payload, user } = response.data.data;

      const { token, refresh_token } = payload;

      // Guardar los datos en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirigir al Home
      window.location.href = "/home";
    } catch (err) {
      console.error("Error al hacer login:", err.response?.data || err.message);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-semibold mb-4">Iniciar Sesión</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
