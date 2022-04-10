import React, { useState, useEffect, ReactNode } from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) && darkMode)
    ) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const background = darkMode ? "#0f172a" : "#fff";
  const color = darkMode ? "#fff" : "#000";

  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-stretch">
      <Head>
        <title>Tokyo Dogruns</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <motion.div
        key="main"
        className="px-4 max-w-screen-xl mx-auto flex-1 w-full"
        variants={variants}
        initial="hidden"
        animate="enter"
        transition={{ type: "linear" }}
      >
        {props.children}
      </motion.div>
      <Footer />
      <style jsx global>{`
        html {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        body {
          margin: 0;
          padding: 0;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          background: ${background};
          color: ${color};
        }

        input,
        textarea {
          font-size: 16px;
        }

        button {
          cursor: pointer;
        }

        .Toastify__toast {
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .Toastify__toast-theme--light,
        .Toastify__toast-theme--dark {
          background: none;
        }
      `}</style>
    </div>
  );
};

export default Layout;
