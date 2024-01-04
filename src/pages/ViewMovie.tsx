import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getMovies, writeComment } from "../store/store";
import moment from "moment";
import Skeleton from "@mui/material/Skeleton";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { motion as m } from "framer-motion";
import { collection } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { firebaseDB } from "../utils/firebase-config";
import { serverTimestamp } from "firebase/firestore";
import { addComment } from "../store/store";
import { likeComment, dislikeComment } from "../store/store";

interface ViewMovieProps {}

export const ViewMovie: React.FC<ViewMovieProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    comment: "",
  });

  const [show, setShow] = useState(false);

  onAuthStateChanged(firebaseAuth, (currentUser: any) => {
    if (!currentUser) navigate("/signUp");
  });

  const selectedMovie = useSelector((state: any) => {
    const moviesView = state.movies.results || [];
    // const movieId = id ? parseInt(id) : null;
    return moviesView.find((movieData: any) => movieData.id === parseInt(id!));
  });

  // const comments = useSelector((state: any) => state.movies.comments);

  const comments = useSelector((state: any) => {
    const selectedMovieId = parseInt(id!);
    return state.movies.comments.filter(
      (comment: any) => comment.movieId === selectedMovieId
    );
  });
  console.log("comments", comments);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, comment: event.target.value });
  };

  const handleCommentSubmit = async () => {
    try {
      if (formValues.comment.trim() === "") {
        console.warn("Comment cannot be empty");
        return;
      }

      const commentsCollectionRef = collection(firebaseDB, "comments");

      const newComment: any = {
        movieId: selectedMovie.id,
        userEmail: firebaseAuth.currentUser?.email,
        userProfilePicture: firebaseAuth.currentUser?.photoURL || "",
        comment: formValues.comment,
        timestamp: serverTimestamp(),
      };

      await addDoc(commentsCollectionRef, newComment);
      dispatch(addComment(newComment));

      setFormValues({ ...formValues, comment: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const currentUserEmail = firebaseAuth.currentUser?.email;

  const userPhotos = [
    ...new Set(
      comments
        .filter((comment: any) => comment.userEmail === currentUserEmail)
        .map((comment: any) => comment.userProfilePicture)
        .filter((item: any) => item)
    ),
  ];

  const userPhotoToShow: any =
    userPhotos.length > 0
      ? userPhotos[0]
      : "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";

  const handleLike = async (movieId: any) => {
    await dispatch(
      likeComment({ movieId: movieId, userEmail: currentUserEmail })
    );
  };

  const handleDislike = async (movieId: any) => {
    await dispatch(dislikeComment({ movieId, userEmail: currentUserEmail }));
  };

  useEffect(() => {
    if (!selectedMovie) {
      dispatch(getMovies(1));
      dispatch(writeComment());
    }
  }, [dispatch, id, selectedMovie, comments]);

  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div>
        {selectedMovie ? (
          <>
            <div className="flex lg:flex-row flex-col gap-6">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
                alt="img"
                className="w-[70%]  lg:w-[40%] object-contain"
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-[22px] md:text-[30px] font-medium mb-3">
                  {selectedMovie.title}
                </h1>

                <div>
                  <span className="mr-2 text-[18px] md:text-[20px] text-purple-700">
                    Rating :
                  </span>
                  <span>⭐{selectedMovie.vote_average}</span>
                </div>
                <div>
                  <span className="mr-2 text-[18px] md:text-[20px] text-purple-700">
                    Year :
                  </span>
                  {/* <span>{selectedMovie.release_date}</span> */}
                  <span>
                    {moment(selectedMovie.release_date).format("DD.MM.YYYY")}
                  </span>
                </div>

                <p>{selectedMovie.overview}</p>
              </div>
            </div>

            <div className="mt-[70px] md:mt-[100px]">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
                alt="img"
                className="w-full md:h-[550px] object-contain"
              />
            </div>
          </>
        ) : (
          <div>
            <Skeleton variant="rectangular" width={"100%"} height={320} />
          </div>
        )}
      </div>

      <div className="mt-[100px] flex flex-col">
        <div className=" flex items-center gap-4">
          <img
            className="w-[44px] h-[44px] object-contain rounded-full mt-2"
            src={userPhotoToShow}
            alt="img"
          />
          <input
            onChange={handleCommentChange}
            value={formValues.comment}
            onClick={() => setShow(true)}
            placeholder="Add comment...."
            className="outline-none w-full bg-transparent text-[18px] border-b-[2px] border-gray-600"
            type="text"
          />
        </div>

        {show && (
          <div className="flex items-center gap-4 justify-end mt-[30px]">
            <button
              onClick={() => setShow(false)}
              className="outline-none text-[16px] font-semibold hover:underline z-10"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleCommentSubmit}
              className="outline-none text-[16px] font-semibold bg-purple-900 hover:bg-purple-700 py-1 px-3 rounded-full z-10"
              type="button"
            >
              Comment
            </button>
          </div>
        )}
      </div>

      <div className="mt-[70px] space-y-7">
        {comments.map((comment: any) => (
          <div key={comment.timestamp} className="flex items-start gap-3">
            <img
              className="w-[34px] h-[34px] object-contain rounded-full mt-5"
              src={
                comment.userProfilePicture ||
                "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              }
              alt="img"
            />
            <div>
              {/* <span className="text-[12px] text-gray-500">
                {comment.timestamp &&
                  (typeof comment.timestamp.toDate === "function"
                    ? moment(comment.timestamp.toDate()).format("DD.MM.YYYY")
                    : moment(comment.timestamp).format("DD.MM.YYYY"))}
              </span> */}
              <span className="text-[12px] text-gray-500">
                {comment.timestamp &&
                  moment(comment.timestamp).format("DD.MM.YYYY")}
              </span>
              <h4>{comment.userEmail}</h4>
              <p className="my-2">{comment.comment}</p>

              <div className="flex items-center gap-3">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    handleLike(comment.movieId);
                  }}
                >
                  👍
                  <span>{comment.likes.length}</span>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    handleDislike(comment.movieId);
                  }}
                >
                  👎
                  <span>{comment.dislikes ? comment.dislikes.length : 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </m.section>
  );
};
