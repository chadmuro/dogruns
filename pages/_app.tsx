import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

// Cannot wrap next/auth SessionProvider with appWIthTranslation
const AppWithI18n = appWithTranslation(App);

const AppWithAuth = (props: AppProps) => {
  return (
    <SessionProvider session={props.pageProps.session}>
      <AppWithI18n {...props} />
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

export default AppWithAuth;
