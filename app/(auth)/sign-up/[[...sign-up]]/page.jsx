import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <Image
          className="w-full object-contain"
          src={"/login.avif"}
          width={500}
          height={500}
          alt="img"
        />
      </div>
      <div className="flex items-center justify-center h-screen">
        <SignUp />
      </div>
    </div>
  );
}
