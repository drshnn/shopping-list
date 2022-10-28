import { ShoppingItem } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import ShoppingBagIcon from "../../public/ShoppingBagIcon";
import AddItemModal from "../components/AddItemModal";
import { trpc } from "../utils/trpc";
import { HiX } from "react-icons/hi";

const Home: NextPage = () => {
  const [isAddActive, setIsAddActive] = useState<boolean>(false);
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
        <main className="mt-20  flex gap-5 px-10 py-5">
          <div className="flex-5 flex-grow ">
            <p className="mb-3 text-xl font-semibold">All Items</p>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  className="flex items-center justify-between border-2 border-black p-5"
                  key={item.id}
                >
                  <span className="">{item.name}</span>
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
          <div className="flex-2">
            {isAddActive && <AddItemModal setItems={setItems} />}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
