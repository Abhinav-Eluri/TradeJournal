import React from 'react';
import { useSelector } from "react-redux";
import HomeAuthenticatedView from "./home/AuthenticatedView.jsx";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        return <HomeAuthenticatedView />;
    }

    return (
      <div className="flex flex-col w-screen h-screen justify-center items-center bg-gray-50 text-black p-6">
          {/* Big Title */}
          <h1 className="text-5xl font-bold mb-6 text-blue-600">
              Welcome to Trade Journal
          </h1>

          {/* Subtitle */}
          <p className="text-lg mb-10 text-gray-700 text-center max-w-xl">
              Track, manage, and improve your stock trading performance.
              Register or login to start managing your trades today!
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
              <Link to="/login">
                  <Button variant="contained" color="primary" size="large">
                      Login
                  </Button>
              </Link>
              <Link to="/register">
                  <Button variant="outlined" color="primary" size="large">
                      Register
                  </Button>
              </Link>
          </div>
      </div>
    );
}

export default Home;
