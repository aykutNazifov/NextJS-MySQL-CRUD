import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddCard from "../components/AddCard";
import UpdateCard from "../components/UpdateCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateItems, setUpdateItems] = useState({});
  const { isLoading, error, data } = useQuery(["cards"], async () => {
    const resData = await axios.get("/api/cards");
    return resData.data;
  });

  const mutation = useMutation(
    (id) => {
      return axios.delete(`/api/cards/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["cards"]);
      },
    }
  );

  const closeAddModal = () => {
    setOpenAddModal(false);
  };

  const closeUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleUpdate = (item) => {
    setUpdateItems(item);
    setOpenUpdateModal(true);
  };

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="w-full text-white py-4 px-6">
      {openAddModal && <AddCard closeAddModal={closeAddModal} />}

      {openUpdateModal && (
        <UpdateCard
          closeUpdateModal={closeUpdateModal}
          updateItems={updateItems}
        />
      )}
      <h1 className="text-center text-4xl font-bold mb-10">Football Cards</h1>
      <button
        className="p-5 border border-solid border-green-800 rounded-2xl bg-black mb-10 mx-auto flex hover:bg-green-800 transition-colors duration-300 ease-in"
        onClick={() => setOpenAddModal(true)}
      >
        Add New Card
      </button>
      {isLoading ? (
        "Loading"
      ) : (
        <div className="flex item-center flex-wrap gap-5 justify-between">
          {data &&
            data.map((item, index) => (
              <div
                key={index}
                className="w-[23%] px-3 py-14 bg-yellow-500 rounded-lg relative h-auto overflow-hidden flex flex-col items-center justify-between"
              >
                <div className="w-full h-[75%]">
                  {item.picture ? (
                    <Image
                      src={item.picture}
                      alt="/"
                      width={500}
                      height={900}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  ) : (
                    <Image
                      src="/images/cat2.jpg"
                      alt="/"
                      width={500}
                      height={900}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  )}
                </div>
                <div className="h-[22%]">
                  <h1 className="text-2xl text-center font-semibold mb">
                    {item.name}
                  </h1>
                  <h3 className="text-xl text-center font-normal mb">
                    {item.team}
                  </h3>
                  <p className="text-center absolute top-2 right-2 py-2 px-3 rounded-full bg-blue-900 text-white">
                    {item.overall}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className=" flex mx-auto mt-2 p-2 rounded-lg border border-solid border-blue-900 hover:bg-blue-900 transition duration-300 ease-in"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleUpdate(item)}
                      className=" flex mx-auto mt-2 p-2 rounded-lg border border-solid border-green-900 hover:bg-green-900 transition duration-300 ease-in"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
