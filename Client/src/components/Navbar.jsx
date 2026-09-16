import React, { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {logout} from '../app/features/authSlice'
import { Mic } from "lucide-react";

export const Navbar = () => {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const logoutuser = () => {
     navigate('/');
     dispatch(logout())
  }
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4 text-slate-800 transition-all">
        <Link to="/">
          <img src="/title.svg" alt="CareerForge AI" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            to="/app/interview"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-200 transition-all text-xs font-medium"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="max-sm:hidden">AI Interview</span>
          </Link>
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

