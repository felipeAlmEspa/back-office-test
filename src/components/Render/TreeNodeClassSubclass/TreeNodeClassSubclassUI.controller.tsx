import { TreeNodeClassSubclassUIView } from "./TreeNodeClassSubclassUI.view";
import { useTreeNodeClassSubclassUI } from "./TreeNodeClassSubclassUI.hook";
import {
  IItemTreeNode,
  TTreeNodeTypeComponent,
} from "@itsa-develop/itsa-fe-components";

export interface ITreeNodeClassSubclassUIControllerProps {
  classId?: number;
  type: TTreeNodeTypeComponent;
  setSubclassId?: (item: IItemTreeNode) => void;
  value?: string;
}

export const TreeNodeClassSubclassUI = ({
  classId,
  type,
  setSubclassId,
  value,
}: ITreeNodeClassSubclassUIControllerProps) => {
  const hook = useTreeNodeClassSubclassUI(type, classId, value, setSubclassId);
  return <TreeNodeClassSubclassUIView {...hook} />;
};
