import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
  deleteObject,
} from "firebase/storage";
import React, { StrictMode, useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { db, storage } from "../config/firebase.config";
import { adminID, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import useUser from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setimageAsset] = useState({
    isImageLoading: false,
    imageAssetURL: null,
    progress: 0,
  });

  const [selectedTags, setselectedTags] = useState([]);

  const {
    data: templates,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templateRefetch,
  } = useTemplates();

  const { data: user, isLoading } = useUser();

  const navigate = useNavigate();

  // handling the input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  // handling the file changes
  const handelFileSelect = async (e) => {
    const file = e.target.files[0];

    setimageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setimageAsset((prevAsset) => ({
            ...prevAsset,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unathorized")) {
            toast.error(`Error : Authorization Revoked`);
          } else {
            toast.error(`Error : ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageAsset((prevAsset) => ({
              ...prevAsset,
              imageAssetURL: downloadURL,
            }));
          });

          toast.success("Image uploaded" ,{position:"top-right"});
          setInterval(() => {
            setimageAsset((prevAsset) => ({
              ...prevAsset,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format");
    }
  };

  // handling image object delete function
  const handleImageDelete = async (e) => {
    toast.success("Image Removed");
    setInterval(() => {
      setimageAsset((prevAsset) => ({
        ...prevAsset,
        progress: 0,
        imageAssetURL: null,
      }));
    }, 2000);
    const deleteRef = ref(storage, imageAsset.imageAssetURL);
    deleteObject(deleteRef).then(() => {});
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleSelectedTags = (tag) => {
    //check if the tag is already selected or not
    if (selectedTags.includes(tag)) {
      // if selected then remove it
      setselectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setselectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.imageAssetURL,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template-${templates.length + 1}`
          : "Template-1",
      timestamp: timestamp,
    };

    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
        setimageAsset((prevAsset) => ({ ...prevAsset, imageAssetURL: null }));
        setselectedTags([]);
        templateRefetch();
        toast.success("Data pused to the cloud");
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };

  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageURL);
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template?._id))
        .then(() => {
          toast.success("Template deleted from the cloud");
          templateRefetch();
        })
        .catch((err) => {
          toast.error(`Error : ${err.message}`);
        });
    });
  };
  useEffect(() => {
    if (isLoading && adminID[0] !== user?.uid) {
      navigate("/", { replace: true });
    }
  }, [user, isLoading]);
  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left part */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>

        {/* template ID part */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            TempID :{" "}
          </p>

          <p className="text-sm text-txtDark capitalize font-bold">
            {templates && templates.length > 0
              ? `Template-${templates.length + 1}`
              : "Template-1"}
          </p>
        </div>

        {/* template title section */}
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
        />

        {/* file uploader section */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] 2xl:[620px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color="#498FCD" size={40} />
                <p className="flex items-center justify-center">
                  {imageAsset.progress.toFixed(2)}%
                </p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.imageAssetURL ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg to-txtLight">Click to upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0 absolute top-52"
                      accept=".jpeg,.jpg,.png"
                      onChange={handelFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.imageAssetURL}
                      alt=""
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />

                    {/* delect action */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={handleImageDelete}
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* text section */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, idx) => (
            <div
              key={idx}
              className={`border px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleSelectedTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>

        {/* button section */}
        <button
          type="button"
          className="w-full bg-blue-700 text-white rounded-md py-2"
          onClick={imageAsset.imageAssetURL ? pushToCloud : undefined}
        >
          Save
        </button>
      </div>

      {/* right part */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
        {templatesIsLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <PuffLoader color="#498FCD" size={40} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid md:grid-cols-2 2xl:grid-cols-3 gap-4 xs:grid-cols-1">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className="w-full h-[400px] overflow-hidden relative rounded-md"
                    >
                      <img
                        src={template?.imageURL}
                        alt=""
                        className="w-full h-full sm:object-contain lg:object-fill"
                      />

                      {/* delect action */}
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={() => removeTemplate(template)}
                      >
                        <div></div>
                        <FaTrash className="text-sm text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="w-full h-full flex items-center justify-center flex-col">
                  <PuffLoader color="#498FCD" size={40} />
                  <p className="text-2xl tracking-wider capitalize text-txtPrimary">
                    No Data
                  </p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
