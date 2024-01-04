import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import { useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (formValues.email && formValues.password) {
      try {
        setLoading(true);
        const { email, password } = formValues;
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Uncorrect user name or password");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Error");
    }
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  });

  return (
    <div className="w-full h-[85dvh] flex justify-center items-center px-5">
      <form
        onSubmit={(e) => {
          e.preventDefault(), handleSubmit();
        }}
        className="pb-10 pt-6 px-8 md:px-12 flex flex-col gap-3 bg-purple-700/40 rounded-lg"
      >
        <div className="flex justify-center pb-6 text-[20px] md:text-[26px] font-medium">
          <h1>Login</h1>
        </div>

        <input
          type="email"
          placeholder="Your email"
          className="outline-none bg-black/30 backdrop-blur-lg text-[18px] px-4 py-2 rounded-full text-white"
          required
          name="email"
          value={formValues.email}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [e.target.name]: e.target.value,
            })
          }
        />
        <input
          type="password"
          placeholder="Your password"
          className="outline-none bg-black/30 backdrop-blur-lg text-[18px] px-4 py-2 rounded-full text-white"
          required
          name="password"
          value={formValues.password}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [e.target.name]: e.target.value,
            })
          }
        />
        {error && (
          <span className="mt-4 mb-2 text-red-500 text-lg font-semibold text-center">
            {error}
          </span>
        )}
        <div className="text-white text-[16px] flex items-center justify-center my-2">
          <span className="text-white/70 mr-2">I don't signed up</span>
          <Link to="/signUp">
            <span className="text-[16px] hover:underline font-semibold cursor-pointer">
              Sign Up
            </span>
          </Link>
        </div>

        <button
          type="submit"
          className="text-[18px] px-4 py-2 rounded-full bg-blue-950 hover:scale-95 transition text-white"
        >
          {loading ? (
            <div className="flex justify-center w-full">
              <div className="w-[24px] h-[24px] border-t-transparent border-white border-2 rounded-full animate-spin"></div>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};
