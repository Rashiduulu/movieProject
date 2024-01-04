import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constans";
import { firebaseDB } from "../utils/firebase-config";
import { getDocs, getDoc, collection } from "firebase/firestore";
import { updateDoc, arrayUnion, doc, arrayRemove } from "firebase/firestore";
import { query, where } from "firebase/firestore";
interface Comment {
  id: string;
  movieId: any;
  userEmail: string;
  comment: string;
  timestamp: any;
  likes?: any[];
  dislikes?: any[];
  likesCount?: any;
  dislikesCount?: any;
}

interface Movie {
  page: number;
  myListMovies: [];
  comments: Comment[];
}

const initialState: Movie = {
  page: 1,
  myListMovies: [],
  comments: [],
};

export const getMovies = createAsyncThunk("allMovies", async (page: number) => {
  try {
    const { data } = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
    );
    console.log(data);
    return { results: data.results, count: data.total_pages };
  } catch (error) {
    console.log(error);
  }
});

export const getLikedMovies = createAsyncThunk("myListMovies", async () => {
  try {
    const myListRef = collection(firebaseDB, "likedMovie");
    const snapshot = await getDocs(myListRef);
    const movies = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return { ...data, id: doc.id };
    });

    console.log("movies", movies);
    return movies;
  } catch (error) {
    console.log("getLikedMovies", error);
    throw error;
  }
});

export const searchMovies = createAsyncThunk(
  "searchMovies",
  async ({ page, query }: any) => {
    try {
      const { data } = await axios.get(
        `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&page=${page}&query=${query}`
      );
      return { results: data.results, count: data.total_pages };
    } catch (error) {
      console.log(error);
    }
  }
);

// export const writeComment = createAsyncThunk(
//   "comments/writeComment",
//   async () => {
//     try {
//       const commentsCollectionRef = collection(firebaseDB, "comments");
//       const commentsSnapshot = await getDocs(commentsCollectionRef);
//       const commentsData = commentsSnapshot.docs.map((doc: any) => doc.data());
//       return commentsData;
//     } catch (error) {
//       console.error("Error loading comments:", error);
//       throw error;
//     }
//   }
// );

// export const writeComment = createAsyncThunk(
//   "comments/writeComment",
//   async () => {
//     try {
//       const commentsCollectionRef = collection(firebaseDB, "comments");
//       const commentsSnapshot = await getDocs(commentsCollectionRef);
//       const commentsData = commentsSnapshot.docs.map((doc: any) => {
//         const data = doc.data();
//         if (data.timestamp && data.timestamp.toDate) {
//           data.timestamp = data.timestamp.toDate();
//         }
//         return data;
//       });
//       return commentsData;
//     } catch (error) {
//       console.error("Error loading comments:", error);
//       throw error;
//     }
//   }
// );

export const writeComment = createAsyncThunk(
  "comments/writeComment",
  async () => {
    try {
      const commentsCollectionRef = collection(firebaseDB, "comments");
      const commentsSnapshot = await getDocs(commentsCollectionRef);
      const commentsData = commentsSnapshot.docs.map((doc: any) => {
        const data = doc.data();
        return { ...data, timestamp: data.timestamp?.toDate()?.getTime() };
      });
      return commentsData;
    } catch (error) {
      console.error("Error loading comments:", error);
      throw error;
    }
  }
);

// export const likeComment = createAsyncThunk(
//   "comments/likeComment",
//   async ({
//     movieId,
//     userEmail,
//   }: {
//     movieId: number;
//     userEmail?: string | null;
//   }) => {
//     try {
//       if (!userEmail) {
//         throw new Error("User email is null or undefined");
//       }

//       const commentRef = collection(firebaseDB, "comments");
//       const querySnapshot = await getDocs(query(commentRef, where("movieId", "==", movieId)));

//       if (querySnapshot.docs.length > 0) {
//         // Предполагаем, что у нас есть только один документ для данного movieId.
//         const commentDoc = querySnapshot.docs[0];
//         const commentData = commentDoc.data();

//         if (!commentData.likes) {
//           commentData.likes = [];
//         }

//         if (!commentData.dislikes) {
//           commentData.dislikes = [];
//         }

//         await updateDoc(commentDoc.ref, {
//           likes: arrayUnion(userEmail),
//         });
//       } else {
//         console.error("Document not found");
//       }
//     } catch (error) {
//       console.error("Error liking comment:", error);
//       throw error;
//     }
//   }
// );

// export const likeComment = createAsyncThunk(
//   "comments/likeComment",
//   async ({
//     movieId,
//     userEmail,
//   }: {
//     movieId: number;
//     userEmail?: string | null;
//   }) => {
//     try {
//       if (!userEmail) {
//         throw new Error("User email is null or undefined");
//       }

//       const commentRef = collection(firebaseDB, "comments");
//       const querySnapshot = await getDocs(query(commentRef, where("movieId", "==", movieId)));

//       if (querySnapshot.docs.length > 0) {
//         // Пройдем по всем найденным документам и обновим их
//         querySnapshot.docs.forEach(async (commentDoc) => {
//           const commentData = commentDoc.data();

//           if (!commentData.likes) {
//             commentData.likes = [];
//           }

//           if (!commentData.dislikes) {
//             commentData.dislikes = [];
//           }

//           await updateDoc(commentDoc.ref, {
//             likes: arrayUnion(userEmail),
//           });
//         });
//       } else {
//         console.error("Document not found");
//       }
//     } catch (error) {
//       console.error("Error liking comment:", error);
//       throw error;
//     }
//   }
// );

// export const likeComment = createAsyncThunk(
//   "comments/likeComment",
//   async ({
//     movieId,
//     userEmail,
//   }: {
//     movieId: number;
//     userEmail?: string | null;
//   }) => {
//     try {
//       if (!userEmail) {
//         throw new Error("User email is null or undefined");
//       }

//       const commentRef = collection(firebaseDB, "comments");
//       const querySnapshot = await getDocs(query(commentRef, where("movieId", "array-contains", movieId)));

//       if (querySnapshot.docs.length > 0) {
//         // Пройдем по всем найденным документам и обновим их
//         querySnapshot.docs.forEach(async (commentDoc) => {
//           const commentData = commentDoc.data();

//           if (!commentData.likes) {
//             commentData.likes = [];
//           }

//           if (!commentData.dislikes) {
//             commentData.dislikes = [];
//           }

//           await updateDoc(commentDoc.ref, {
//             likes: arrayUnion(userEmail),
//           });
//         });
//       } else {
//         console.error("Document not found");
//       }
//     } catch (error) {
//       console.error("Error liking comment:", error);
//       throw error;
//     }
//   }
// );

// export const likeComment = createAsyncThunk(
//   "comments/likeComment",
//   async ({ movieId, userEmail }: { movieId: number; userEmail?: string | null }) => {
//     try {
//       if (!userEmail) {
//         throw new Error("User email is null or undefined");
//       }

//       const commentRef = collection(firebaseDB, "comments");
//       const querySnapshot = await getDocs(query(commentRef, where("movieId", "==", movieId)));

//       if (querySnapshot.docs.length > 0) {
//         const commentDoc = querySnapshot.docs[0];

//         const commentData = commentDoc.data();
//         const likes = commentData.likes || [];

//         if (!likes.includes(userEmail)) {
//           await updateDoc(commentDoc.ref, {
//             likes: arrayUnion(userEmail),
//             dislikes: arrayRemove(userEmail),
//           });
//         } else {
//           await updateDoc(commentDoc.ref, {
//             likes: arrayRemove(userEmail),
//           });
//         }
//       } else {
//         console.error("Document not found");
//       }

//       // Возвращаем movieId, чтобы использовать его в reducer
//       return movieId;
//     } catch (error) {
//       console.error("Error liking comment:", error);
//       throw error;
//     }
//   }
// );

// export const likeComment = createAsyncThunk(
//   "comments/likeComment",
//   async ({ movieId, userEmail }: { movieId: number; userEmail?: string | null }) => {
//     try {
//       if (!userEmail) {
//         throw new Error("User email is null or undefined");
//       }

//       const commentRef = collection(firebaseDB, "comments");
//       const querySnapshot = await getDocs(query(commentRef, where("movieId", "==", movieId)));

//       if (querySnapshot.docs.length > 0) {
//         const commentDoc = querySnapshot.docs[0];
//         const commentData = commentDoc.data();

//         const likes = commentData.likes || [];
//         const dislikes = commentData.dislikes || [];

//         if (!likes.includes(userEmail)) {
//           await updateDoc(commentDoc.ref, {
//             likes: arrayUnion(userEmail),
//             dislikes: arrayRemove(userEmail),
//           });
//         } else {
//           await updateDoc(commentDoc.ref, {
//             likes: arrayRemove(userEmail),
//           });
//         }
//       } else {
//         console.error("Document not found");
//       }

//       // Возвращаем movieId, чтобы использовать его в reducer
//       return movieId;
//     } catch (error) {
//       console.error("Error liking comment:", error);
//       throw error;
//     }
//   }
// )

// export const dislikeComment = createAsyncThunk(
//   "comments/dislikeComment",
//   async ({ movieId, userEmail }: { movieId: number; userEmail?: string | null }) => {
//     try {
//       if (!userEmail) {
//         throw new Error("User email is null or undefined");
//       }

//       const commentRef = collection(firebaseDB, "comments");
//       const querySnapshot = await getDocs(query(commentRef, where("movieId", "==", movieId)));

//       if (querySnapshot.docs.length > 0) {
//         const commentDoc = querySnapshot.docs[0];

//         const commentData = commentDoc.data();
//         const dislikes = commentData.dislikes || [];

//         if (!dislikes.includes(userEmail)) {
//           await updateDoc(commentDoc.ref, {
//             dislikes: arrayUnion(userEmail),
//             likes: arrayRemove(userEmail),
//           });
//         } else {
//           await updateDoc(commentDoc.ref, {
//             dislikes: arrayRemove(userEmail),
//           });
//         }
//       } else {
//         console.error("Document not found");
//       }

//       // Возвращаем movieId, чтобы использовать его в reducer
//       return movieId;
//     } catch (error) {
//       console.error("Error disliking comment:", error);
//       throw error;
//     }
//   }
// );

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async ({
    movieId,
    userEmail,
  }: {
    movieId: number;
    userEmail?: string | null;
  }) => {
    try {
      if (!userEmail) {
        throw new Error("User email is null or undefined");
      }

      const commentRef = collection(firebaseDB, "comments");
      const querySnapshot = await getDocs(
        query(commentRef, where("movieId", "==", movieId))
      );

      if (querySnapshot.docs.length > 0) {
        const commentDoc = querySnapshot.docs[0];
        const commentData = commentDoc.data();

        const likes = commentData.likes || [];
        const dislikes = commentData.dislikes || [];

        // Убираем дизлайк, если он уже был установлен
        if (dislikes.includes(userEmail)) {
          await updateDoc(commentDoc.ref, {
            dislikes: arrayRemove(userEmail),
          });
        }

        if (!likes.includes(userEmail)) {
          await updateDoc(commentDoc.ref, {
            likes: arrayUnion(userEmail),
          });
        } else {
          // Если лайк уже был установлен, то снимаем его
          await updateDoc(commentDoc.ref, {
            likes: arrayRemove(userEmail),
          });
        }
      } else {
        console.error("Document not found");
      }

      // Возвращаем movieId, чтобы использовать его в reducer
      return movieId;
    } catch (error) {
      console.error("Error liking comment:", error);
      throw error;
    }
  }
);

export const dislikeComment = createAsyncThunk(
  "comments/dislikeComment",
  async ({
    movieId,
    userEmail,
  }: {
    movieId: number;
    userEmail?: string | null;
  }) => {
    try {
      if (!userEmail) {
        throw new Error("User email is null or undefined");
      }

      const commentRef = collection(firebaseDB, "comments");
      const querySnapshot = await getDocs(
        query(commentRef, where("movieId", "==", movieId))
      );

      if (querySnapshot.docs.length > 0) {
        const commentDoc = querySnapshot.docs[0];
        const commentData = commentDoc.data();
        const likes = commentData.likes || [];
        const dislikes = commentData.dislikes || [];

        // Убираем лайк, если он уже был установлен
        if (likes.includes(userEmail)) {
          await updateDoc(commentDoc.ref, {
            likes: arrayRemove(userEmail),
          });
        }

        if (!dislikes.includes(userEmail)) {
          await updateDoc(commentDoc.ref, {
            dislikes: arrayUnion(userEmail),
          });
        } else {
          // Если дизлайк уже был установлен, то снимаем его
          await updateDoc(commentDoc.ref, {
            dislikes: arrayRemove(userEmail),
          });
        }
      } else {
        console.error("Document not found");
      }

      // Возвращаем movieId, чтобы использовать его в reducer
      return movieId;
    } catch (error) {
      console.error("Error disliking comment:", error);
      throw error;
    }
  }
);

const MoviesSlice = createSlice({
  name: "Movies",
  initialState,
  reducers: {
    addComment: (state: any, action: any) => {
      state.comments.push(action.payload);
    },

    // // count likes
    // likeComment: (state, action) => {
    //   const { comment, userEmail } = action.payload;
    //   const foundComment = state.comments.find(
    //     (c: Comment) => c.movieId === comment.movieId
    //   );
    //   if (
    //     foundComment &&
    //     foundComment.likes &&
    //     !foundComment.likes.includes(userEmail)
    //   ) {
    //     foundComment.likes.push(userEmail);
    //     foundComment.likesCount = foundComment.likes.length;
    //   }
    // },

    // dislikeComment: (state: any, action: any) => {
    //   const { comment, userEmail } = action.payload;
    //   const foundComment = state.comments.find(
    //     (c: Comment) => c.movieId === comment.movieId
    //   );
    //   if (
    //     foundComment &&
    //     foundComment.dislikes &&
    //     !foundComment.dislikes.includes(userEmail)
    //   ) {
    //     foundComment.dislikes.push(userEmail);
    //     foundComment.dislikesCount = foundComment.dislikes.length;
    //   }
    // },

    likeComment: (state, action) => {
      const { comment, userEmail } = action.payload;
      const foundComment = state.comments.find((c) => c.movieId === comment.movieId);
    
      if (foundComment && foundComment.likes && !foundComment.likes.includes(userEmail)) {
        foundComment.likes.push(userEmail);
        foundComment.likesCount = foundComment.likes.length;
      }
    },

    dislikeComment: (state: any, action: any) => {
      const { comment, userEmail } = action.payload;
      const foundComment = state.comments.find(
        (c: Comment) => c.movieId === comment.movieId
      );
      if (
        foundComment &&
        foundComment.dislikes &&
        !foundComment.dislikes.includes(userEmail)
      ) {
        foundComment.dislikes.push(userEmail);
        foundComment.dislikesCount = foundComment.dislikes.length;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getMovies.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(getMovies.fulfilled, (state: any, action: any) => {
      state.results = action.payload.results;
      state.count = action.payload.count;
      state.loading = false;
    });
    builder.addCase(searchMovies.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(searchMovies.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.results = action.payload.results;
      state.count = action.payload.count;
    });
    builder.addCase(getLikedMovies.pending, (state: any, action: any) => {
      state.myListMovies = action.payload;
      state.loading = true;
    });
    builder.addCase(getLikedMovies.fulfilled, (state: any, action: any) => {
      state.myListMovies = action.payload;
      state.loading = false;
    });
    //comments
    builder.addCase(writeComment.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(writeComment.fulfilled, (state: any, action: any) => {
      state.comments = action.payload;
      state.loading = false;
    });
  },
});

export const store = configureStore({
  reducer: {
    movies: MoviesSlice.reducer,
  },
});

export const { addComment } = MoviesSlice.actions;

export type AppDispatch = typeof store.dispatch;
