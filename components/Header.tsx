import Link from "next/link";
import { useRouter } from "next/router";
import Button from "./shared/Button";

const Header = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let left = (
    <Link href="/">
      <a data-active={isActive("/")} className="text-lg">
        Dog Runs
      </a>
    </Link>
  );

  let right = (
    <Link href="/login">
      <a>
        <Button type="button" text="Login" />
      </a>
    </Link>
  );

  return (
    <nav className="flex p-4 items-center justify-between max-w-screen-xl mx-auto w-full">
      {left}
      {right}
    </nav>
  );
};

export default Header;
