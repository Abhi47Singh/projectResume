import React, { useEffect } from "react";
import { Logo } from "../assets";
import { Footer } from "../container";
import { AuthButtonWithProvider } from "../components";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import {MainSpinner} from "../components";

const Authentication = () => {
  const { data, isLoading, isError } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data, navigate]);

  if(isLoading) {
    return <MainSpinner/>
  }

  return (
    <div className="auth-section">
      <img src={Logo} className="w-10 h-auto object-contain" alt="Logo" />
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
        <h1 className="text-3xl lg:text-4xl text-blue-700">Welcome to Expressume</h1>
        <p className="text-base text-gray-600">express way to create resume</p>
        <h2 className="text-2xl text-gray-600">Authenticate</h2>
        <div className="w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-start gap-6">
          <AuthButtonWithProvider
            Icon={FaGoogle}
            label={"Sign in with Google"}
            provider={"GoogleAuthProvider"}
          />
          <AuthButtonWithProvider
            Icon={FaGithub}
            label={"Sign in with GitHub"}
            provider={"GithubAuthProvider"}
          />
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Authentication;
