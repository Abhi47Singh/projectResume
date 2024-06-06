import React, { Suspense } from "react";
import { Header, MainSpinner } from "../components";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomeContainer } from "../container";
import {CreateResume, CreateTemplate, TemplateDesignPingDetails, UserProfile} from "../pages";
const HomeScreen = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* header */}
      <Header />

      {/* custom router */}
      <main className="w-full">
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path={"/"} element={<HomeContainer />} />
            <Route path={"/template/create"} element={<CreateTemplate/>} />
            <Route path={"/profile/:uid"} element={<UserProfile/>} />
            <Route path={"/resume/*"} element={<CreateResume/>} />
            <Route path={"/resumeDetail/:templateID"} element={<TemplateDesignPingDetails/>} />
          </Routes>
        </Suspense>
      </main>

      {/* footer */}
    </div>
  );
};

export default HomeScreen;
