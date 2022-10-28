import { ShoppingItem } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";

interface AddItemModalProps {
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>;
}

const AddItemModal: FC<AddItemModalProps> = ({ setItems }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { mutate: addItem } = trpc.item.createItem.useMutation({
    onSuccess: (shoppingItem) => {
      setItems((prev) => [...prev, shoppingItem]);
      setLoading(false);
      setItemName("");
    },
  });
  const [itemName, setItemName] = useState<string>("");
  return (
    <div className="flex  flex-col gap-5 border-2 border-black p-5">
      <h2 className="text-xl font-semibold ">Add item</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (itemName.trim() !== "") {
            setLoading(true);
            addItem({ name: itemName.trim() });
          }
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex w-full flex-col gap-1">
          <label htmlFor="item-name">Name of item</label>
          <input
            type="text"
            className="border-2 border-black p-2 outline-none "
            name="item-name"
            onChange={(e) => setItemName(e.target.value)}
            value={itemName}
          />
        </div>

        {loading ? (
          <button
            type="submit"
            className="flex h-10 items-center justify-center border-2 border-black bg-black font-bold  text-white transition duration-150 ease-in-out"
          >
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            className="flex h-10 items-center justify-center border-2 border-black font-bold transition  duration-150 ease-in-out hover:bg-black hover:text-white"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default AddItemModal;
