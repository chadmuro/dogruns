import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let left = (
    <div>
      <Link href="/">
        <a data-active={isActive("/")}>Dog Runs</a>
      </Link>
    </div>
  );

  let right = (
    <div>
      <button>Login</button>
    </div>
  );

  return (
    <nav className="flex p-2 items-center justify-between">
      {left}
      {right}
    </nav>
  );
};

export default Header;
