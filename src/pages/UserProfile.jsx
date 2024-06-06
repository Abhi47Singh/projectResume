import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
import { MainSpinner, TemplateDesignPin } from "../components";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSaveResumes } from "../api";

const UserProfile = () => {
  const { data: user } = useUser();

  const navigate = useNavigate()
  const {
    data: templates,
    refetch: temp_refetch,
    isLoading: tempIsLoading,
  } = useTemplates();

  const {data:saveResumes} = useQuery(["saveResumes"],()=>getSaveResumes(user?.uid))

  // useEffect(()=>{
  //   if(!user){
  //     navigate("/auth",{replace:true})
  //   }
  // },[])

  if(tempIsLoading) {
    return <MainSpinner/>
  }
  const [activeTab, setActiveTab] = useState("collections");
  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72 bg-blue-50">
        <img
          src="https://images.pexels.com/photos/704767/pexels-photo-704767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
          className="w-full h-full object-contaion "
        />

        <div
          className="flex items-center justify-center flex-col gap-4
        "
        >
          {user?.photoURL ? (
            <React.Fragment>
              <img
                src={user?.photoURL}
                alt=""
                className=" w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <img
                src="https://images.pexels.com/photos/704767/pexels-photo-704767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt=""
                className=" w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          )}

          <p className="text-2xl text-txtDark">{user?.displayName}</p>

          {/* tabs */}
          <div className="flex items-center justify-center mt-12 ">
            <div
              className={` px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
              onClick={() => setActiveTab("collections")}
            >
              <p
                className={`text-base text-txtPrimary group-hover:text-blue-500 px-4 py-1 rounded-full ${
                  activeTab === "collections" &&
                  "bg-white shadow-md text-blue-600"
                }`}
              >
                Collections
              </p>
            </div>

            <div
              className={` px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
              onClick={() => setActiveTab("resumes")}
            >
              <p
                className={`text-base text-txtPrimary group-hover:text-blue-500 px-4 py-1 rounded-full ${
                  activeTab === "resumes" && "bg-white shadow-md text-blue-600"
                }`}
              >
                My Resumes
              </p>
            </div>
          </div>

          {/* tab content */}
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
            <AnimatePresence>
              {activeTab === "collections" && (
                <React.Fragment>
                  {user?.collections.length > 0 && user?.collections ? (
                    <RenderATemplate templates={templates?.filter((items) => user?.collections?.includes(items?._id))}/>
                  ) : (
                    <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                      <img src={NoData} alt="" className="w-32 h-auto object-contain"/>
                      <p>Add Somthing</p>
                    </div>
                  )}
                </React.Fragment>
              )}

              {activeTab === "resumes" && <React.Fragment></React.Fragment>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((templete, index) => (
                <TemplateDesignPin
                  key={templete?._id}
                  data={templates}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
