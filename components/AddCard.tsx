import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface IAddCard {
  closeAddModal: () => void;
}

type TInputs = {
  name: string;
  team: string;
  overall: string;
};

const AddCard: React.FC<IAddCard> = ({ closeAddModal }) => {
  const [inputs, setInputs] = useState({
    name: "",
    team: "",
    overall: "",
    picture: "",
  });
  const [image, setImage] = useState<File>();

  useEffect(() => {
    const imageName = image && new Date().getTime() + image.name;
    const uploadImage = () => {
      const storageRef = ref(storage, imageName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setInputs({ ...inputs, picture: downloadURL });
          });
        }
      );
    };
    image && uploadImage();
  }, [image]);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (inputs: TInputs) => {
      return axios.post("/api/cards", inputs);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["cards"]);
      },
    }
  );

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    mutation.mutate(inputs);
    closeAddModal();
  };

  return (
    <div className=" flex items-center justify-center absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-40 w-[70%] h-[70%] h-auto bg-white rounded-3xl text-black">
      <div className="py-10 px-10 w-full ">
        <h1 className="text-center text-2xl mb-20">Add Footballer Cards</h1>
        <p
          className="absolute top-2 right-2 text-3xl font-bold cursor-pointer"
          onClick={closeAddModal}
        >
          X
        </p>
        <div className="flex items-center justify-center  w-full gap-2 mb-10">
          <label>Name:</label>
          <input
            type="text"
            className="border w-[60%] border-solid border-transparent border-b-gray-500 "
            placeholder="Name..."
            name="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center  justify-center  w-full gap-2 mb-10">
          <label>Team:</label>
          <input
            className="border border-solid border-transparent w-[60%] border-b-gray-500 "
            type="text"
            placeholder="Team..."
            name="team"
            value={inputs.team}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center w-full gap-2 mb-10">
          <label>Overall:</label>
          <input
            className="border w-[60%] border-solid border-transparent border-b-gray-500 "
            type="text"
            placeholder="Overall..."
            name="overall"
            value={inputs.overall}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center w-full gap-2 mb-10">
          <label>Image:</label>
          <input
            type="file"
            placeholder="Image..."
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button
          onClick={handleAdd}
          className="py-4 px-12 rounded-xl bg-green-900 text-white mx-auto flex mt-5"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddCard;
