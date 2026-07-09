import React, { use } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const user = { name: "Rajdip Mondal" };
  const navigate = useNavigate();
  const logoutuser = () => {
     navigate('/');
  }
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4 text-slate-800 transition-all">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Hi, {user?.name}</p>
          <button
            onClick={logoutuser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 tracking-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};
