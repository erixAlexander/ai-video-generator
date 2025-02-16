import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React, { useContext } from "react";
import { UserDetailContext } from "../../_context/UserDetailContext";

function Header({ setHidden }) {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className="p-3 px-5 flex items-center justify-between shadow-md fixed w-full bg-white">
      <div
        onClick={() => setHidden((prev) => !prev)}
        className="flex gap-3 items-center"
      >
        <Image
          className="hidden md:block"
          src={"/logo.svg"}
          width={30}
          height={30}
          alt="logo"
        />
        <Image
          className="block md:hidden"
          src={"/ham.png"}
          width={25}
          height={25}
          alt="logo"
        />

        <h2 className="font-bold text-xl">Ai Short Video</h2>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex gap-1 items-center justify-center">
          <Image src={"/star.png"} width={20} height={20} alt="star" />
          <h2>{userDetail?.credits}</h2>
        </div>
        <button>Dashboard</button>
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
