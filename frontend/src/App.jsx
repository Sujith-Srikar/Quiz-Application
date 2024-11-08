import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SignIn, SignUp, Dashboard } from "./pages/index";
import app from "./firebase";
import { Example } from "./components/Login.jsx";

const auth = getAuth(app);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Example />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
