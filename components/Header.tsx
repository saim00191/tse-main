"use client";

import { useRouter } from "next/navigation";
import Logo from "@/public/image.png";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/admin-login");
  };
  return (
    <div className="w-full h-[80px] bg-white border-b-2 border-gray-200">
      <div className="mx-auto max-w-[1440px] flex items-center justify-between h-full px-5">
        <Link href={"/"}>
          <Image src={Logo} alt="logo" className="h-[60px] w-[150px]" />
        </Link>
        <button
          onClick={handleLogout}
          className="h-[40px] px-6 text-white bg-gradient-to-r from-indigo-600 cursor-pointer to-purple-600 rounded-2xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
