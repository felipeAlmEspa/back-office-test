import { useCollaboratorSelectorUI } from "./CollaboratorSelectorUI.hook";
import { CollaboratorSelectorUIView } from "./CollaboratorSelectorUI.view";

export interface CollaboratorSelectorUIProps {
  lineBusinessId: number;
  onChange: (value?: number) => void;
  value?: number;
  label: string;
  status?: "error" | "warning";
  onSelectObject?: (collaborator?: import("@/view/Wholesale/interfaces").ICollaborator) => void;
}

export const CollaboratorSelectorUI = (props: CollaboratorSelectorUIProps) => {
  const hook = useCollaboratorSelectorUI(props);
  return <CollaboratorSelectorUIView {...hook} />;
};
