import React, { useEffect, useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { FadeInOutWithOpacity, scaleInOut } from "../animation";
import { BiFolderPlus, BiHeart } from "react-icons/bi";
import useUser from "../hooks/useUser";
import { saveToCollection, saveToFavourites } from "../api";
import { RxCross2 } from "react-icons/rx";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, index }) => {
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: temp_refetch } = useTemplates();
  const [add, setAdd] = useState(false);
  const [addFav, setAddFav] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // collection
  useEffect(() => {
    if (user?.collections?.includes(data[index]?._id)) {
      setAdd(true);
    } else {
      setAdd(false);
    }
  }, [user, data, index]);

  // fav
  useEffect(() => {
    if (data[index]?.favourites?.includes(user?.uid)) {
      setAddFav(true);
    } else {
      setAddFav(false);
    }
  }, [user, data, index]);

  const addToCollection = async (e, data) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
  };

  const addToFav = async (e, data) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
  };
  const navigate = useNavigate()
  const handleRouteNavigation = (e) => {
    navigate(`/resumeDetail/${data[index]?._id}`, {replace: true})
  };
  return (
    <motion.div key={data?._id} {...scaleInOut(index)}>
      {/* h-[500px] 2xl:h-[650px] */}
      <div
        className="w-full rounded-md bg-gray-200 overflow-hidden relative h-[450px] 2xl:h-[650px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* w-full h-full object-cover */}
        <img
          src={data[index]?.imageURL}
          className="w-full h-full object-cover"
          alt=""
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              {...FadeInOutWithOpacity}
              onClick={handleRouteNavigation}
              className="inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer absolute"
            >
              <div className="flex flex-col items-end justify-start w-full gap-8">
                <InnerBoxCard
                  lable={add ? "Remove From Collection" : "Add To Collection"}
                  Icon={add ? RxCross2 : BiFolderPlus}
                  onHandle={(e) => addToCollection(e, data[index])}
                  add={add}
                />

                <InnerBoxCard
                  lable={
                    !addFav ? "Add To Favourites" : "Remove From Favourites"
                  }
                  Icon={addFav ? FaHeart : BiHeart} // FaHeart
                  onHandle={(e) => addToFav(e, data[index])}
                  addFav={addFav}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ lable, Icon, onHandle }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={onHandle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
    >
      <Icon className="text-red-500 text-lg" />
      <AnimatePresence className>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className={`px-3 py-2 rounded-md bg-gray-200 absolute 
             -left-[200px]
             after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45`}
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{lable}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
