import React, { useEffect } from "react";
import { FaBars, FaPlus, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { firebaseAuth } from "../utils/firebase-config";
import { signOut, signInWithPopup } from "firebase/auth";
import { FaUser, FaPowerOff } from "react-icons/fa";
import { GoogleAuthProvider } from "firebase/auth";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navbar = [
    { id: "1", name: "Movies", link: "/movies" },
    { id: "3", name: "My List", link: "/myList" },
  ];

  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalLogOut, setModalLogOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const authStateChangedHandler = (user: any | null) => {
      setCurrentUser(user);
    };

    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      authStateChangedHandler
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNavigationClick = (link: any) => {
    if (link === "/myList" && !currentUser) {
      navigate("/signUp");
    } else {
      navigate(link);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (error: any) {
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <header className="flex justify-between items-center py-4 ">
      <Link to="/">
        <h1 className="text-[32px] lg:text-[40px] font-semibold cursor-pointer">
          🐦‍⬛Movies
        </h1>
      </Link>

      <div>
        <ul className="md:flex items-center gap-10 text-[18px] font-medium hidden">
          {navbar.map((item) => (
            <div onClick={() => handleNavigationClick(item.link)}>
              <Link to={item.link} key={item.id}>
                <li
                  className={`cursor-pointer hover:text-purple-600 transition ${
                    location.pathname === item.link
                      ? "text-purple-600 underline underline-offset-4"
                      : ""
                  }`}
                >
                  {item.name}
                </li>
              </Link>
            </div>
          ))}

          {currentUser ? (
            <li
              className="cursor-pointer hover:text-purple-600 "
              onClick={() => setModalLogOut(!modalLogOut)}
            >
              <FaPowerOff title="Log Out" />
            </li>
          ) : (
            <li
              className="cursor-pointer hover:text-purple-600"
              onClick={() => setOpenModal(!openModal)}
            >
              <FaUser />
            </li>
          )}

          {openModal && (
            <div
              className="w-full h-[100dvh] fixed top-0 left-0 bg-black/50 backdrop-blur-lg z-50 flex justify-center items-center text-white"
              onClick={() => setOpenModal(false)}
            >
              <div
                className="flex flex-col gap-4 bg-purple-900 p-8 rounded-sm text-[14px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex item-center gap-2">
                  <a href="/signup">
                    <span className="cursor-pointer  hover:underline">
                      Sign Up
                    </span>
                  </a>
                  |
                  <a href="/login">
                    <span className="cursor-pointer  hover:underline">
                      Sign In
                    </span>
                  </a>
                </div>

                <div
                  className="flex justify-center items-center gap-1 cursor-pointer hover:underline"
                  onClick={() => {
                    handleGoogleSignIn();
                    setOpenModal(false);
                  }}
                >
                  <FaGoogle />
                  <span>With google</span>
                </div>
              </div>
            </div>
          )}

          {modalLogOut && (
            <div
              className="w-full h-[100dvh] fixed top-0 left-0 bg-black/50 backdrop-blur-lg z-50 flex justify-center items-center text-white"
              onClick={() => setOpenModal(false)}
            >
              <div
                className="flex items-center gap-2 bg-purple-900 p-8 rounded-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="cursor-pointer text-[14px] hover:underline"
                  onClick={() => {
                    signOut(firebaseAuth);
                    setTimeout(() => {
                      window.location.reload();
                    }, 300);
                  }}
                >
                  Log Out
                </span>
                |
                <span
                  className="cursor-pointer text-[14px] hover:underline"
                  onClick={() => setModalLogOut(false)}
                >
                  Cancel
                </span>
              </div>
            </div>
          )}
        </ul>
      </div>

      <FaBars
        onClick={() => setOpen(true)}
        className="block md:hidden cursor-pointer hover:text-purple-600"
      />

      <div
        onClick={() => setOpen(false)}
        className={`fixed top-0 left-0 w-full h-[100dvh] bg-black/25 backdrop-blur-md cursor-pointer block md:hidden z-50  ${
          open ? "block" : "hidden"
        }`}
      ></div>

      <div
        className={`fixed top-0 left-0 w-full transition duration-500 ease-out block md:hidden z-50 ${
          open ? "translate-x-[0]" : "translate-x-[100%]"
        }`}
        onClick={() => setOpen(false)}
      >
        <FaPlus
          onClick={() => setOpen(false)}
          className="block md:hidden absolute top-8 right-[16px] z-50 rotate-45 cursor-pointer hover:text-purple-600"
        />

        <ul className="gap-10 text-[24px] font-medium bg-purple-950 backdrop-blur-md w-[90%] sm:w-[70%] h-[100dvh] fixed top-0 right-0 flex flex-col justify-center items-center ">
          {navbar.map((item) => (
            <Link to={item.link} key={item.id}>
              <li
                className={`cursor-pointer hover:text-purple-600 transition ${
                  location.pathname === item.link
                    ? "text-purple-600 underline underline-offset-4"
                    : ""
                }`}
              >
                {item.name}
              </li>
            </Link>
          ))}
          {currentUser ? (
            <li
              className="cursor-pointer hover:text-purple-600 transition text-[16px]"
              onClick={() => {
                signOut(firebaseAuth);
                // window.location.reload();
              }}
            >
              Log Out
            </li>
          ) : (
            <>
              <div
                className="flex items-center gap-2 text-[16px]"
                onClick={(e) => e.stopPropagation()}
              >
                <a href="/signup">
                  <span className="cursor-pointer text-[14px] hover:underline">
                    Sign Up
                  </span>
                </a>
                |
                <a href="/login">
                  <span className="cursor-pointer text-[14px] hover:underline">
                    Sign In
                  </span>
                </a>
              </div>
              <div
                className="flex justify-center items-center gap-1 text-[14px] cursor-pointer hover:underline "
                onClick={() => {
                  handleGoogleSignIn();
                  setOpenModal(false);
                }}
              >
                <FaGoogle />
                <span>With google</span>
              </div>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};
