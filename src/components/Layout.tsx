import React from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <section className="container m-auto  md:px-[70px] lg:px-[100px] px-4">
      <div className="z-[99]">
        <Header />
      </div>
      <div className="mt-[40px] sm:mt-[50px] md:mt-[70px] lg:mt-[100px] mb-[50px] z-[9]">
        <Outlet />
      </div>
    </section>
  );
};
