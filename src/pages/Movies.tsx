import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getMovies } from "../store/store";
import Pagination from "@mui/material/Pagination";
import { Cards } from "../components/Cards";
import { FaSearch } from "react-icons/fa";
import { motion as m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../store/store";
interface MoviesProps {}

export const Movies: React.FC<MoviesProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: any) => state.movies.results);
  const count = useSelector((state: any) => state.movies.count);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>([]);
  const [open, setOpen] = useState(false);

  console.log("movies", movies);
  console.log("count", count);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getMovies(page));
  }, [dispatch, page]);

  const handleChangePage = (event: any, value: any) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventItem = event.target.value;
    setSearch(eventItem);
    if (eventItem) {
      dispatch(searchMovies({ page: 1, query: eventItem }));
    } else {
      dispatch(getMovies(page));
    }
  };

  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <h1 className="text-[26px] md:text-[32px] font-medium mb-[50px]">
        Movies
      </h1>

      {open && (
        <div
          className="fixed top-0 left-0 w-full h-[100dvh]"
          onClick={() => setOpen(false)}
        >
          {" "}
        </div>
      )}

      <div className="flex justify-end mb-[30px]">
        <div className="relative">
          <FaSearch className="search-i absolute left-6 top-[13px] " />
          <input
            className="z-10 w-full sm:w-auto search-input outline-none pl-12 px-5 py-2 text-[16px] bg-purple-800/30 rounded-full border-[2px] border-transparent transition duration-500 focus:border-purple-500 "
            type="text"
            onChange={handleSearch}
            value={search}
            onClick={() => setOpen(true)}
          />
          {/* {open && (
            <div className="absolute top-[100%] z-10 bg-purple-900/50 backdrop-blur-md rounded-b-md pb-4">
              {searchResult.length === 0 && search && (
                <p className="px-3 pt-2 text-gray-400 w-full sm:w-[252px]">
                  No results found
                </p>
              )}

              {searchResult.map((item: any) => (
                <ul className="px-3 pt-2 w-full sm:w-[252px]" key={item.key}>
                  <li
                    className="hover:underline cursor-pointer"
                    onClick={() => navigate(`/viewMovie/${item.id}`)}
                  >
                    {item.title}
                  </li>
                </ul>
              ))}
            </div>
          )} */}
        </div>
      </div>

      <Cards allMovies={movies} />

      <div className="text-white mt-[60px] flex justify-end mb-[50px]">
        <Pagination
          page={page}
          count={count}
          onChange={handleChangePage}
          color="primary"
          size="large"
        />
      </div>
    </m.section>
  );
};
