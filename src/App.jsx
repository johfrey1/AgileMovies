import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import MovieDetail from "./components/MovieDetail";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
