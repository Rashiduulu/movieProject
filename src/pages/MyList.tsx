import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import { Cards } from "../components/Cards";
import { getLikedMovies } from "../store/store";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { motion as m } from "framer-motion";

interface MyListProps {
  page: number;
}

export const MyList: React.FC<MyListProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: any) => state.movies.myListMovies);
  console.log("myListMovies", movies);

  useEffect(() => {
    dispatch(getLikedMovies());
  }, [dispatch]);

  onAuthStateChanged(firebaseAuth, (currentUser: any) => {
    if (!currentUser) navigate("/signUp");
  });

  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <h1 className="mt-[40px] sm:mt-[50px] md:mt-[70px] lg:mt-[100px] text-[26px] md:text-[32px] font-medium mb-[50px]">
        My List
      </h1>
      <Cards allMovies={movies} />
    </m.section>
  );
};
