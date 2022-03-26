import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Button from "./shared/Button";
import useComponentVisible from "./hooks/useComponentVisible";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const { data: session, status } = useSession();

  let authButton;
  if (status === "loading") {
    authButton = <div className="w-8" />;
  } else if (!session) {
    authButton = (
      <Link href="/auth/signin">
        <a>
          <Button type="button" text="Login" />
        </a>
      </Link>
    );
  } else if (session) {
    authButton = (
      <div className="relative flex flex-col items-end">
        <button
          type="button"
          className="flex text-sm bg-gray-800 rounded-full mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="dropdown"
          onClick={() => setIsComponentVisible(true)}
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 rounded-full"
            src={session.user?.image || ""}
            alt="user photo"
          />
        </button>
        {/* <!-- Dropdown menu --> */}
        <div
          ref={ref}
          className="absolute z-50 my-8 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
          id="dropdown"
        >
          {isComponentVisible && (
            <>
              <div className="py-3 px-4">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {session.user?.name}
                </span>
                <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                  {session.user?.email}
                </span>
              </div>
              <ul className="py-1" aria-labelledby="dropdown">
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Language
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    );
  }

  let left = (
    <Link href="/">
      <a data-active={isActive("/")} className="text-xl">
        Tokyo Dog Runs
      </a>
    </Link>
  );

  let right = (
    <div className="flex items-center md:order-2 relative">
      <button
        id="theme-toggle"
        type="button"
        className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <svg
            id="theme-toggle-light-icon"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            id="theme-toggle-dark-icon"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        )}
      </button>
      {authButton}
    </div>
  );

  return (
    <nav className="flex p-4 items-center justify-between max-w-screen-xl mx-auto w-full">
      {left}
      {right}
    </nav>
  );
};

export default Header;
