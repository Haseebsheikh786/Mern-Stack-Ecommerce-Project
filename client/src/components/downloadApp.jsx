import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import mobile from "../assets/images/mobile.png";
import darkLogo from "../assets/images/White Modern Minimal E-Commerce Logo (1).png";
import lightLogo from "../assets/images/White Modern Minimal E-Commerce Logo.png";
import { selectedMode, toggleSelectedMode } from "../app/toggleSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectDeferredPrompt, setDeferredPrompt } from "../app/pwaSlice";
import { selectUserInfo } from "../pages/auth/authSlice";
import { useNavigate } from "react-router-dom";

const App = () => {
  const user = useSelector(selectUserInfo);
  const deferredPrompt = useSelector(selectDeferredPrompt);
 
  const themeMode = useSelector(selectedMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const install = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        dispatch(setDeferredPrompt(null)); // Clear the prompt after use
      });
    }
  };
  const login = () => {
    navigate("/login");
  };

  const redirectToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen space-x-5 mx-4 overflow-hidden">
      <div>
        {!themeMode ? (
          <img src={darkLogo} alt="logo" className="w-40 mx-auto sm:mx-0" />
        ) : (
          <img src={lightLogo} alt="logo" className="w-40 mx-auto sm:mx-0" />
        )}
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center sm:text-start">
          Experience the power of the
        </h1>
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center sm:text-start">
          E-Shop app today
        </h1>
        <p className="mb-6 text-center sm:text-start">
          Enjoy a seamless shopping experience.
          <br />
          Stay connected and shop from anywhere.{" "}
        </p>
        <div className="flex space-x-4 justify-center">
          <Button
            variant="outline"
            onClick={install}
            disabled={!deferredPrompt}
          >
            Download
          </Button>
          {!user ? (
            <Button variant="default" onClick={login}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 
                    3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 
                    9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
              Login
            </Button>
          ) : (
            <Button variant="default" onClick={redirectToDashboard}>
              {/* <Icon icon="iconoir:dashboard-dots" className="mr-2 h-4 w-4" /> */}
              Dashboard
            </Button>
          )}
        </div>
        {!deferredPrompt && (
          <p className="text-red-600 pt-1 text-center sm:text-start">
            The app is already installed
          </p>
        )}
      </div>
      {/* <div className="hidden sm:block w-60">
        <img
          src={mobile}
          alt="Phone Mockup"
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
};

export default App;
