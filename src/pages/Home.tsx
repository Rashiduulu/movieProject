import React, { useEffect, useState } from "react";
import { Slider } from "../components/Slider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getMovies } from "../store/store";
import { motion as m } from "framer-motion";

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: any) => state.movies.results);
  const count = useSelector((state: any) => state.movies.count);
  console.log("movies", movies);
  console.log("count", count);

  useEffect(() => {
    dispatch(getMovies(1));
  }, [dispatch]);

  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.7, ease: "easeOut" }}
    >
      <h1 className="text-[26px] md:text-[32px] font-medium mb-[50px]">
        Movies
      </h1>

      <Slider allMovies={movies} />
    </m.section>
  );
};
