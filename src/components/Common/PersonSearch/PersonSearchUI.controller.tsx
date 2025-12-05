import { usePersonSearchUI } from "./PersonSearchUI.hook";
import { PersonSearchUIView } from "./PersonSearchUI.view";


export const PersonSearchUI = () => {
  const hook = usePersonSearchUI();

  return <PersonSearchUIView {...hook} />;
};
