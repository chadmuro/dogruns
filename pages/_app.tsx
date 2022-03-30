import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <SnackbarProvider>
        <Component {...pageProps} />
      </SnackbarProvider>
    </SessionProvider>
  );
};

export default App;
