import { Outlet } from "react-router-dom";
import { MainLayoutUIView } from "./MainLayoutUI.view";
import { useMainLayoutUI } from "./MainLayoutUI.hook";
export const MainLayoutUI = () => {
  const hook = useMainLayoutUI();

  return <MainLayoutUIView {...hook} children={<Outlet />} />;
};
