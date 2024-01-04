import React, { useEffect, useState } from "react";
import { firebaseDB } from "../utils/firebase-config";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
interface CardProps {
  index: any;
  moviesData: any;
}

export const Card: React.FC<CardProps> = ({ moviesData, index }) => {
  const [like, setLike] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLikeMovie = async () => {
    try {
      const movieRef = doc(firebaseDB, "likedMovie", moviesData.id.toString());

      onAuthStateChanged(auth, async (user: any) => {
        if (user) {
          const userEmail = user.email;
          if (like) {
            await deleteDoc(movieRef);
            localStorage.removeItem(`like_${moviesData.id}`);
          } else {
            try {
              await setDoc(movieRef, { ...moviesData, userEmail });
              localStorage.setItem(`like_${moviesData.id}`, "true");
            } catch (firestoreError) {
              console.error("Firestore error:", firestoreError);
              return;
            }
          }
          setLike(!like);
        } else {
          setLike(false);
          navigate("/signUp");
        }
      });
    } catch (error) {
      console.error("Error handling like:", error);
      throw error;
    }
  };

  const handleClick = () => {
    if (auth.currentUser) {
      navigate(`/viewMovie/${moviesData.id}`);
    } else {
      navigate("/signUp");
      console.log("User is not authenticated.");
    }
  };

  useEffect(() => {
    const isLiked = localStorage.getItem(`like_${moviesData.id}`);
    onAuthStateChanged(auth, (user: any) => {
      if (user && isLiked === "true") {
        setLike(true);
      } else {
        setLike(false);
      }
    });
  }, [moviesData.id, auth]);

  return (
    <section>
      <div key={moviesData.id} className="cursor-pointer mb-4 m-3">
        <div className="relative brightness-75 hover:brightness-100 transition ">
          <img
            onClick={handleClick}
            src={`https://image.tmdb.org/t/p/w500${moviesData.backdrop_path}`}
            alt="img"
            className="w-full"
          />

          <div className="absolute bottom-3 right-3">
            {like ? (
              <div
                className="text-[22px] "
                onClick={() => {
                  setLike(false), handleLikeMovie();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="purple"
                    d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138c0-4.863-5.5-8.312-10-3.636C7.5.825 2 4.274 2 9.137Z"
                  />
                </svg>
              </div>
            ) : (
              <div
                className="text-[22px] active:scale-[1.2] "
                onClick={() => {
                  setLike(true), handleLikeMovie();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m8.962 18.91l.464-.588l-.464.589ZM12 5.5l-.54.52a.75.75 0 0 0 1.08 0L12 5.5Zm3.038 13.41l.465.59l-.465-.59Zm-5.612-.588C7.91 17.127 6.253 15.96 4.938 14.48C3.65 13.028 2.75 11.335 2.75 9.137h-1.5c0 2.666 1.11 4.7 2.567 6.339c1.43 1.61 3.254 2.9 4.68 4.024l.93-1.178ZM2.75 9.137c0-2.15 1.215-3.954 2.874-4.713c1.612-.737 3.778-.541 5.836 1.597l1.08-1.04C10.1 2.444 7.264 2.025 5 3.06C2.786 4.073 1.25 6.425 1.25 9.137h1.5ZM8.497 19.5c.513.404 1.063.834 1.62 1.16c.557.325 1.193.59 1.883.59v-1.5c-.31 0-.674-.12-1.126-.385c-.453-.264-.922-.628-1.448-1.043L8.497 19.5Zm7.006 0c1.426-1.125 3.25-2.413 4.68-4.024c1.457-1.64 2.567-3.673 2.567-6.339h-1.5c0 2.198-.9 3.891-2.188 5.343c-1.315 1.48-2.972 2.647-4.488 3.842l.929 1.178ZM22.75 9.137c0-2.712-1.535-5.064-3.75-6.077c-2.264-1.035-5.098-.616-7.54 1.92l1.08 1.04c2.058-2.137 4.224-2.333 5.836-1.596c1.659.759 2.874 2.562 2.874 4.713h1.5Zm-8.176 9.185c-.526.415-.995.779-1.448 1.043c-.452.264-.816.385-1.126.385v1.5c.69 0 1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16l-.929-1.178Z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-[16px] font-medium mt-1">{moviesData.title}</h2>
          {/* <div>
            <span className="mr-2">⭐{moviesData.vote_average}</span>

            <span className="text-[14px]">
              {moment(moviesData.release_date).format("YYYY")}
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
};
