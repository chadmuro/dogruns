import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="min-h-screen flex flex-col justify-center items-stretch">
    <Header />
    <div className="px-4 max-w-screen-xl mx-auto flex-1 w-full">
      {props.children}
    </div>
    <Footer />
    <style jsx global>{`
      html {
        box-sizing: border-box;
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
        background: #0f172a; // Slate 900
        color: #fff;
      }

      input,
      textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
      }
    `}</style>
  </div>
);

export default Layout;
