import { ShoppingItem } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import ShoppingBagIcon from "../../public/ShoppingBagIcon";
import AddItemModal from "../components/AddItemModal";
import { trpc } from "../utils/trpc";
import { HiX } from "react-icons/hi";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { itemRouter } from "../server/trpc/router/itemRouter";

const Home: NextPage = () => {
  const [isAddActive, setIsAddActive] = useState<boolean>(false);
  const [isClearLoading, setIsClearLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const { data: itemsData, isLoading } = trpc.item.getItem.useQuery(
    {},
    {
      onSuccess: (shoppingList) => {
        setItems(shoppingList);
      },
    }
  );

  const { mutate: deleteItem } = trpc.item.deleteItem.useMutation({
    onSuccess: (shoppingItem) => {
      setItems((prev) => prev.filter((item) => item.id !== shoppingItem.id));
    },
  });

  const { mutate: checkItem } = trpc.item.checkItem.useMutation({
    onSuccess: (shoppingItem) => {
      setItems(shoppingItem);
    },
  });
  const { mutate: deleteAllItems } = trpc.item.deleteAllItems.useMutation({
    onSuccess: (items) => {
      setIsClearLoading(false);
      setItems([]);
    },
  });
  if (!itemsData || isLoading) return <p>Loading...</p>;
  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="Website for shopping list" />
        <link rel="icon" href="/shopping-bag.svg" />
      </Head>
      <div>
        <nav className="fixed top-0 z-50 flex w-screen justify-between border-b-2 border-black bg-white  py-5 px-10 ">
          <header className=" flex cursor-pointer select-none items-center  gap-2 text-xl font-bold">
            <span className="">
              <ShoppingBagIcon />
            </span>
            My Shopping List
          </header>
          <button
            onClick={() => setIsAddActive((prev) => !prev)}
            className="border-2 border-black py-1 px-5 font-bold transition  duration-150 ease-in-out hover:bg-black hover:text-white"
          >
            {isAddActive ? "Close" : "Add"}
          </button>
        </nav>
        <main className="mt-20 flex flex-col gap-5 px-10  py-5 sm:flex-row">
          <div className="flex-5 order-2 flex-grow sm:order-1">
            <div className="flex w-full justify-between">
              <p className="mb-3 text-xl font-semibold">All Items</p>
              {isClearLoading ? (
                <button
                  className="flex h-8 w-20
                 items-center justify-center border-2 border-black bg-black font-bold  text-white transition duration-150 ease-in-out"
                >
                  <svg
                    className="h-5 w-5 animate-spin text-white"
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
                  className="flex h-8 w-20 items-center justify-center border-2 border-black bg-black  text-white transition duration-150 ease-in-out"
                  onClick={() => {
                    if (items.length !== 0) {
                      setIsClearLoading(true);
                      deleteAllItems({});
                    }
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  className="flex items-center gap-5 border-2 border-black p-5"
                  key={item.id}
                >
                  <div
                    className=""
                    onClick={() =>
                      checkItem({ id: item.id, checked: !item.checked })
                    }
                  >
                    {item.checked ? (
                      <ImCheckboxChecked />
                    ) : (
                      <ImCheckboxUnchecked />
                    )}
                  </div>

                  <span
                    className={`flex-1 ${
                      item.checked && "line-through"
                    } text-xl`}
                  >
                    {item.name}
                  </span>
                  <button
                    className="flex h-8 w-8 items-center justify-center text-xl hover:bg-black hover:text-white"
                    onClick={() => deleteItem({ id: item.id })}
                  >
                    <HiX />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-2 order-1 sm:order-2">
            {isAddActive && <AddItemModal setItems={setItems} />}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
