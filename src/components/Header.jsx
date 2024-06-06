import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { Logo } from "../assets";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { FaCircleUser } from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";
import { FadeInOutWithOpacity, popUpMenuAnimation } from "../animation";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { CiUser } from "react-icons/ci";
import { adminID } from "../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import useFilters from "../hooks/useFilters";

const getInitials = (user) => {
  if (user?.displayName) {
    const names = user.displayName.split(" ");
    const initials = names.map((name) => name[0].toUpperCase()).join("");
    return initials;
  } else if (user?.email) {
    const emailInitial = user.email[0].toUpperCase();
    return emailInitial;
  }
  return null;
};

const Header = () => {
  const { data, isLoading, isError } = useUser();
  const initials = data ? getInitials(data) : null;

  const [isMenu, setMenu] = useState(false);

  const queryClient = useQueryClient();

  const singOutMethod = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  const { data: filterData } = useFilters();

  const handleSearchTerm = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: e.target.value,
    });
  };

  const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  }
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0">
      {/* logo */}
      <Link to={"/home"}>
        <img src={Logo} className="w-7 h-auto object-contain" alt="Logo" />
      </Link>

      {/* input */}
      <div className="flex-1 border border-gray-300 px-4 py-2 rounded-md flex items-center justify-between bg-gray-200">
        <input
          value={filterData?.searchTerm ? filterData?.searchTerm : ""}
          onChange={handleSearchTerm}
          type="text"
          placeholder="Search here..."
          className="flex-1 h-5 bg-transparent text-sm font-semibold placeholder:text-sm outline-none border-none"
        />

        <AnimatePresence>
          {filterData?.searchTerm.length > 0 && (
            <motion.div
              onClick={clearFilter}
              {...FadeInOutWithOpacity}
              className="w-8 h-8 flex items-center justify-center  bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150"
            >
              <p className="text-2xl text-black -mt-1">x</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* profile section */}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498FCD" size={30} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div className="relative">
                {data?.photoURL ? (
                  <div
                    className="w-full h-8 rounded-md items-center justify-center flex relative"
                    onClick={() => setMenu(!isMenu)}
                  >
                    <img
                      src={data?.photoURL}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-cover rounded-3xl"
                      alt="Profile"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full items-center justify-center flex relative shadow-md bg-blue-500">
                    {initials ? (
                      <span className="text-white text-xs font-bold">
                        {initials}
                      </span>
                    ) : (
                      <FaCircleUser className="text-white" size={20} />
                    )}
                  </div>
                )}

                {/* dropdown menu */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      className="absolute px-4 py-3 rounded-md bg-white right-0 top-11 flex flex-col items-center justify-start gap-3 pt-4 w-60"
                      onMouseLeave={() => setMenu(!isMenu)}
                      {...popUpMenuAnimation}
                    >
                      {/* section -1 */}
                      {data?.photoURL ? (
                        <div className="rounded-md items-center justify-center flex relative">
                          <img
                            src={data?.photoURL}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-3xl"
                            alt="Profile"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center relative shadow-md bg-blue-500">
                          {initials ? (
                            <span className="text-white text-md font-bold">
                              {initials}
                            </span>
                          ) : (
                            <FaCircleUser className="text-white" size={30} />
                          )}
                        </div>
                      )}

                      {/* section-2 */}
                      {data?.displayName && (
                        <p className="text-sm text-txtDark">
                          {data?.displayName}
                        </p>
                      )}

                      {/* menu options */}
                      <div className="w-full flex flex-col items-start gap-6 pt-6 text-sm">
                        <Link
                          className="whitesapce-nowrap text-txtLight hover:text-txtDark transition ease-in-out duration-100"
                          to={`/profile/${data?.uid}`}
                        >
                          My Acount
                        </Link>

                        {adminID.includes(data?.uid) && (
                          <Link
                            className="text-txtLight hover:text-txtDark transition ease-in-out duration-100 whitespace-nowrap"
                            to={"/template/create"}
                          >
                            Add New Template
                          </Link>
                        )}
                        <div
                          className="w-full px-2 py-2 border-t border-gray-100 flex justify-between items-center group font-semibold cursor-pointer"
                          onClick={singOutMethod}
                        >
                          <p className="group-hover:text-txtDark text-txtLight transition ease-in-out duration-100">
                            Sign Out
                          </p>
                          <PiSignOut className="group-hover:text-txtDark text-txtLight transition ease-in-out duration-100 flex-shrink-0" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button className="flex justify-space w-full items-center text-txtLight gap-2 font-bold transition-all ease-in-out duration-100 hover:text-txtDark">
                  <p>Login</p>
                  <CiUser size={20} className="font-bold" />
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
      <ToastContainer position="bottom-right" theme="dark" autoClose={2000} />
    </header>
  );
};

export default Header;
