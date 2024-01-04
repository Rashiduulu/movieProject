import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Movies } from "./pages/Movies";
import { MyList } from "./pages/MyList";
import { Home } from "./pages/Home";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { ViewMovie } from "./pages/ViewMovie";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Layout />}>
          <Route path="signUp" element={<SignUp />}></Route>
          <Route path="login" element={<Login />}></Route>

          <Route index element={<Home />}></Route>
          <Route path="movies" element={<Movies />}></Route>
          <Route path="myList" element={<MyList />}></Route>
          <Route path="viewMovie/:id" element={<ViewMovie />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
