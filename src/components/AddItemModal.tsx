import { ShoppingItem } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";

interface AddItemModalProps {
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>;
}

const AddItemModal: FC<AddItemModalProps> = ({ setItems }) => {
  const { mutate: addItem } = trpc.item.createItem.useMutation({
    onSuccess: (shoppingItem) => {
      setItems((prev) => [...prev, shoppingItem]);
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
          addItem({ name: itemName });
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
        <button
          type="submit"
          className="w-40 border-2 border-black py-1 px-5 font-bold transition  duration-150 ease-in-out hover:bg-black hover:text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItemModal;
