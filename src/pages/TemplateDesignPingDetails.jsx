import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getTemplateDetails, saveToCollection, saveToFavourites } from "../api";
import { MainSpinner, TemplateDesignPin } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";

const TemplateDesignPingDetails = () => {
  const { templateID } = useParams();

  const { data, isLoading, isError, refetch } = useQuery(
    ["templates", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();
  const {
    data: templates,
    refetch: temp_refetch,
    isLoading: tempIsLoading,
  } = useTemplates();

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error while fetching the data...Please try again later
        </p>
      </div>
    );
  }

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
    refetch();
  };

  const addToFav = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
    refetch();
  };

  return (
    <div className="w-full flex flex-col items-center justify-start px-4 py-5">
      {/* bread crump */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* main section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 ">
        {/* left section */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          {/* laod the template image */}
          <img
            src={data?.imageURL}
            alt=""
            className="w-full h-auto object-contain rounded-md"
          />

          {/* title and other option */}
          <div className="w-full flex flex-col items-start gap-2 justify-start">
            {/* title section */}
            <div className="w-full flex items-center justify-between px-4">
              {/* titile */}
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>
              {/* likes section */}
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* collection & fav options */}

          {user && (
            <div className="flex items-center justify-center gap-3 px-3">
              {/* collection  */}
              {user?.collections?.includes(data?._id) ? (
                <React.Fragment>
                  <div className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer">
                    <BiSolidFolderPlus className="text-lg text-txtPrimary" />
                    <p
                      className="text-sm text-txtPrimary whitespace-nowrap"
                      onClick={addToCollection}
                    >
                      Remove From Collection
                    </p>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div
                    className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    onClick={addToCollection}
                  >
                    <BiFolderPlus className="text-lg text-txtPrimary" />
                    <p className="text-sm text-txtPrimary whitespace-nowrap">
                      Add To Collection
                    </p>
                  </div>
                </React.Fragment>
              )}

              {/* fav section */}
              {data?.favourites?.includes(user?.uid) ? (
                <React.Fragment>
                  <div className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer">
                    <BiSolidHeart className="text-lg text-red-500" />
                    <p
                      className="text-sm text-txtPrimary whitespace-nowrap"
                      onClick={addToFav}
                    >
                      Remove From Favourites
                    </p>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div
                    className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    onClick={addToFav}
                  >
                    <BiHeart className="text-lg text-txtPrimary" />
                    <p className="text-sm text-txtPrimary whitespace-nowrap">
                      Add To Favourites
                    </p>
                  </div>
                </React.Fragment>
              )}
            </div>
          )}
        </div>

        {/* right section */}
        <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 py-6 pt-0">
          {/* discover more */}
          <div
            className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative mt-20"
            style={{
              background:
                "url(https://cdn.pixabay.com/photo/2017/04/23/19/30/earth-2254769_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className=" absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-4 py-2 rounded-md border-2 border-gray-50 text-white hover:scale-90 transition-all ease-in-out"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* edit the template */}
          {user && (
            <Link
              to={`/resume/${data?.name}?templateID=${templateID}`}
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer mt-3"
            >
              <p className="text-white font-semibold text-lg ">
                Edit this Template
              </p>
            </Link>
          )}

          {/* tags */}
          <div className=" w-full flex items-center justify-start flex-wrap gap-2">
            {data?.tags?.map((tag, index) => {
              return (
                <p
                  className="text-sm border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap mt-3"
                  key={index}
                >
                  {tag}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* simillar templates */}
      {templates?.filter((temp) => temp._id !== data?._id)?.length > 0 && (
        <div className="w-full py-8 flex flex-col items-start  justify-start gap-4">
          <p className="text-lg font-semibold text-txtDark">
            You might also like
          </p>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            <React.Fragment>
              <AnimatePresence>
                {templates
                  ?.filter((temp) => temp._id !== data?._id)
                  .map((templete, index) => (
                    <TemplateDesignPin
                      key={templete?._id}
                      data={templates}
                      index={index}
                    />
                  ))}
              </AnimatePresence>
            </React.Fragment>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDesignPingDetails;
