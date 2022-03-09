import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "./shared/Button";

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
      <Button text="Login" />
    </div>
  );

  return (
    <nav className="flex p-4 items-center justify-between">
      {left}
      {right}
    </nav>
  );
};

export default Header;
