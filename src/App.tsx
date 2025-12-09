"use client";
import { RouterProvider } from "react-router-dom";
import router from "./RouterBackOffice/RouterApp";
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
