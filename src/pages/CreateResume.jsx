import React from "react";
import { Route, Routes } from "react-router-dom";
import { TemplateData } from "../utils/helpers";

const CreateResume = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start py-4">
      <Routes>
        {TemplateData.map((tempInfo) => (
          <Route
            key={tempInfo.id}
            path={`/${tempInfo.name.toLowerCase()}`}
            element={<tempInfo.component />}
          />
        ))}
      </Routes>
    </div>
  );
};

export default CreateResume;
