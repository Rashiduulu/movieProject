import React, { useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Card } from "./Card";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getMovies } from "../store/store";

interface SliderProps {
  allMovies: any;
}

export const Slider: React.FC<SliderProps> = ({ allMovies }) => {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: any) => state.movies.loading);

  useEffect(() => {
    dispatch(getMovies(1));
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: true,
    prevArrow: (
      <div>
        <span className="custom-arrow custom-prev">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m7.825 10l2.9 2.9q.3.3.288.7t-.288.7q-.3.3-.7.313t-.7-.288L4.7 9.7q-.15-.15-.213-.325T4.426 9q0-.2.063-.375T4.7 8.3l4.575-4.575q.3-.3.713-.3t.712.3q.3.3.3.7t-.3.7L7.825 8H17q.825 0 1.413.588T19 10v9q0 .425-.288.713T18 20q-.425 0-.712-.288T17 19v-9H7.825Z"
            />
          </svg>
        </span>
      </div>
    ),
    nextArrow: (
      <div>
        <span className="custom-arrow custom-next">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5 20V8h11.175l-3.6-3.575L14 3l6 6l-6.025 6.025l-1.4-1.425l3.6-3.6H7v10H5Z"
            />
          </svg>
        </span>
      </div>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <section>
      <SlickSlider {...settings}>
        {loading ? (
          <div className="relative">
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={180}
              style={{ backgroundColor: "#000" }}
            />
          </div>
        ) : (
          allMovies?.map((movie: any, index: any) => (
            <Card moviesData={movie} index={index} key={movie.id} />
          ))
        )}
      </SlickSlider>
    </section>
  );
};
