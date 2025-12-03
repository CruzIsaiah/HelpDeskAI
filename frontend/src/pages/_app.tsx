import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          rel="icon"
          href="/favicon-16.svg"
          sizes="16x16"
          type="image/svg+xml"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="app-font">
        <Component {...pageProps} />
      </div>
    </>
  );
}
