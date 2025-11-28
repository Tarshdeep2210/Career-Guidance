import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTelegramPlane , FaGithub} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black/90 backdrop-blur-md text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h2 className="text-lg font-bold text-violet-400">CareerPath</h2>
        <p className="text-sm text-green-400">Empowering your career journey</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 text-sm items-center">
        <Link to="/home/dashboard" className="hover:text-violet-400 transition">
          Dashboard
        </Link>

        <a
          href="https://www.instagram.com/accounts/onetap/?next=%2F"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-pink-400 transition"
        >
          <FaInstagram /> Instagram
        </a>

        <a
          href="https://www.linkedin.com/in/tarshdeep-kaur-55ba13296/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-400 transition"
        >
          <FaTelegramPlane /> LinkedIn
        </a>
         <a
          href="https://github.com/Tarshdeep2210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-400 transition"
        >
          <FaGithub /> GitHub
        </a>
      </div>

      <p className="text-xs text-gray-400 mt-2 md:mt-0">
        © 2025 CareerPath. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
