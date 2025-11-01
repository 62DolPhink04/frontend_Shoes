import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Outlet } from "react-router-dom";
import NavBar from "../components/headers/NavBar";
import ChatWidget from "../pages/ChatWidget";

const MainLayout = () => {
  return (
    <main className="dark:bg-black overflow-hidden">
      <NavBar />
      <Outlet />
      <ChatWidget />

      <footer className="bg-white text-black p-6 mt-10">
        <hr className="border-gray-700 mb-6" />
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* --- Cột 1 --- */}
          <div>
            <h3 className="text-lg font-bold">Plans</h3>
            <ul className="mt-2 space-y-1">
              <li>Study help</li>
              <li>Test prep</li>
              <li>College credit</li>
              <li>Teacher resources</li>
              <li>Working Scholars®</li>
              <li>School group plans</li>
              <li>Online tutoring</li>
            </ul>
          </div>

          {/* --- Cột 2 --- */}
          <div>
            <h3 className="text-lg font-bold">About us</h3>
            <ul className="mt-2 space-y-1">
              <li>Blog</li>
              <li>Careers</li>
              <li>Teach for us</li>
              <li>Press Center</li>
              <li>Ambassador</li>
              <li>Scholarships</li>
            </ul>
          </div>

          {/* --- Cột 3 --- */}
          <div>
            <h3 className="text-lg font-bold">Support</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href="https://www.facebook.com/"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://zalo.me/pc"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  Zalo
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  Tiktok
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>Feedback</li>
            </ul>
          </div>

          {/* --- Cột 4: Map + CTA --- */}
          <div>
            <h3 className="text-lg font-bold">Our Location</h3>
            <div className="mt-2 w-full h-40 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <iframe
                title="Google Map"
                src="https://maps.app.goo.gl/1Qc1GQEKfGQ9YWCB7"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <a href="http://localhost:5173/register">
              <button className="bg-yellow-500 text-black font-bold py-2 px-4 rounded mt-3 w-full hover:bg-yellow-400">
                Create an account
              </button>
            </a>

            <p className="mt-2 text-sm text-center">
              Already a member?{" "}
              <a
                href="http://localhost:5173/login"
                className="text-blue-400 hover:underline"
              >
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* --- Bottom line --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-t border-gray-300 pt-4 text-sm">
          <p>&copy; 2025 Study.com. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0 text-xl">
            <FaFacebook className="hover:text-blue-600 cursor-pointer" />
            <FaYoutube className="hover:text-red-600 cursor-pointer" />
            <FaInstagram className="hover:text-pink-600 cursor-pointer" />
            <FaTwitter className="hover:text-sky-500 cursor-pointer" />
            <FaLinkedin className="hover:text-blue-700 cursor-pointer" />
          </div>
        </div>
      </footer>
    </main>
  );
};

export default MainLayout;
