import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../firebase.js";

const auth = getAuth(app);
const googleauthprovider = new GoogleAuthProvider();

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold error messages

  const createUser = (e) => {
    e.preventDefault();

    // Check password length before making the API call
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setError(""); // Clear error on successful signup
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(errorMessage);
      });
  };

  const signUpwithGoogle = () => {
    signInWithPopup(auth, googleauthprovider);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Sign Up
        </h1>
        <form onSubmit={createUser} className="space-y-4">
          <div>
            <label
              htmlFor="email-signup"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email-signup"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password-signup"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password-signup"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
          {/* Display error message */}
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="my-4 text-center">
          <span className="text-sm text-gray-600">or</span>
        </div>
        <div>
          <button
            onClick={signUpwithGoogle}
            className="w-full py-3 mt-4 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center"
          >
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;