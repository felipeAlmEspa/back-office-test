import { Dashboard } from "@itsa-develop/itsa-fe-components";
import { IHomeUIHookProps } from "./HomeUI.hook";

export const HomeUIView = ({ handleNavigateProgram }: IHomeUIHookProps) => {
  return (
    <Dashboard
      handleNavigateProgram={(program) => {
        handleNavigateProgram(program);
      }}
    />
  );
};
