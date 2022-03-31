import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        closeButton={false}
        limit={5}
        theme="dark"
      />
    </SessionProvider>
  );
};

export default appWithTranslation(App);
