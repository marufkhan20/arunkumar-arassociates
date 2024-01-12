"use client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "../store";
import "./globals.css";

// const localAuth = localStorage?.getItem("auth");

// if (localAuth) {
//   const auth = JSON.parse(localAuth);
//   if (auth?.accessToken && auth?.user) {
//     store.dispatch(
//       userLoggedIn({ accessToken: auth.accessToken, user: auth.user })
//     );
//   }
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
