import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface IAddCard {
  closeUpdateModal: () => void;
  updateItems: any;
}

type TInputs = {
  name: string;
  team: string;
  overall: string;
};

const UpdateCard: React.FC<IAddCard> = ({ closeUpdateModal, updateItems }) => {
  const [inputs, setInputs] = useState({
    name: "",
    team: "",
    overall: "",
  });

  useEffect(() => {
    setInputs(updateItems);
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (inputs: TInputs) => {
      return axios.put("/api/cards/" + updateItems.id, inputs);
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
    closeUpdateModal();
  };

  return (
    <div className="absolute top-1/2 right-1/2 z-40 bg-white rounded-3xl text-black">
      <div className="py-10 px-10">
        <h1 className="text-center text-2xl mb-4">Update Footballer Cards</h1>
        <p
          className="absolute top-2 right-2 text-3xl font-bold cursor-pointer"
          onClick={closeUpdateModal}
        >
          X
        </p>
        <div className="flex items-center gap-2 mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="border border-solid border-transparent border-b-gray-500 "
            placeholder="Name..."
            name="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-1 mb-3">
          <label>Team:</label>
          <input
            className="border border-solid border-transparent border-b-gray-500 "
            type="text"
            placeholder="Team..."
            name="team"
            value={inputs.team}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-1 mb-3">
          <label>Overall:</label>
          <input
            className="border border-solid border-transparent border-b-gray-500 "
            type="text"
            placeholder="Overall..."
            name="overall"
            value={inputs.overall}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleAdd}
          className="py-2 px-4 rounded-xl bg-green-900 text-white mx-auto flex mt-5"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateCard;
