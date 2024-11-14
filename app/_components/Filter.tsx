"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC } from "react";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = searchParams.get("capacity") ?? "all";
  console.log(pathname);

  const filterHandler = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex border border-primary-800">
      <Button
        filterHandler={filterHandler}
        filter="all"
        activeFilter={activeFilter}
      >
        All Cabins
      </Button>
      <Button
        filterHandler={filterHandler}
        filter="small"
        activeFilter={activeFilter}
      >
        1&mdash;3
      </Button>

      <Button
        filterHandler={filterHandler}
        filter="meduim"
        activeFilter={activeFilter}
      >
        4&mdash;7
      </Button>
      <Button
        filterHandler={filterHandler}
        filter="large"
        activeFilter={activeFilter}
      >
        8&mdash;12
      </Button>
    </div>
  );
};
interface ButtonProps {
  filter: string;
  activeFilter: string;
  filterHandler: (filter: string) => void;
  children: string;
}
const Button: FC<ButtonProps> = ({
  filterHandler,
  filter,
  activeFilter,
  children,
}) => {
  return (
    <button
      onClick={() => filterHandler(filter)}
      className={`${
        activeFilter === filter && "bg-primary-700"
      } px-5 py-2 hover:bg-primary-700`}
    >
      {children}
    </button>
  );
};

export default Filter;
