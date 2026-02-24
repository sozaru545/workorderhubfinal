import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "../components/Sidebar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white min-h-screen">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
