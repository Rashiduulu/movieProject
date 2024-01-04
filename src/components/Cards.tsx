import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Card } from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getMovies } from "../store/store";

interface CardsProps {
  allMovies: any;
}

export const Cards: React.FC<CardsProps> = ({ allMovies }) => {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: any) => state.movies.loading);

  useEffect(() => {
    dispatch(getMovies(1));
  }, [dispatch]);

  return (
    <section>
      {loading ? (
        <div className="flex justify-center w-full py-10 ">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allMovies?.map((movie: any, index: any) => (
            <Card moviesData={movie} index={index} key={movie.id} />
          ))}
        </div>
      )}
    </section>
  );
};
