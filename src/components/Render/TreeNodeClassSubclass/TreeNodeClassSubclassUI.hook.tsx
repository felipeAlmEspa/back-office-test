import {
  useGetSubclassById,
  useSubclassesTree,
} from "@/services/spare/subclasses/subClasses.service";
import {
  IItemTreeNode,
  TTreeNodeTypeComponent,
  useModalResponsive,
  useTreesNodeStore,
} from "@itsa-develop/itsa-fe-components";
import { useEffect, useMemo, useState } from "react";
import { filterTreeNodes, transformDataSubClassesToTreeNode } from "@/helper";
import { SubclasseCreateUI } from "@/view/Spares/Maintenance/Subclasses/create/SubclasseCreateUI.controller";
import { useUrlSearchParamsFilters } from "@/hooks/useUrlSearchParamsFilters";
import { SubclasseUpdateUI } from "@/view/Spares/Maintenance/Subclasses/update/SubclasseUpdateUI.controller";

export interface ITreeNodeClassSubclassUIHook {
  treesNodes: IItemTreeNode[];
  filteredTreesNodes: IItemTreeNode[];
  filterValue: string;
  setFilterValue: (value: string) => void;
  type: TTreeNodeTypeComponent;
  handleAddChild: (parentItem: IItemTreeNode) => void;
  handleAddParent: () => void;
  handleConfirmAction: () => void;
  handleCloseModal: () => void;
  handleEditTreeNode: (node: IItemTreeNode, parentId?: number) => void;
  itemSelected?: IItemTreeNode; 
  setItemSelected: (item: IItemTreeNode) => void;
}

export const useTreeNodeClassSubclassUI = (
  type: TTreeNodeTypeComponent,
  classId?: number,
  value?: string,
  setSubclassId?: (item: IItemTreeNode) => void
): ITreeNodeClassSubclassUIHook => {
  const { setSearchParams } = useUrlSearchParamsFilters([
    "classId",
    "parentSubclassId",
  ]);
  const { openModal, closeModal } = useModalResponsive();
  const [itemSelected, setItemSelected] = useState<IItemTreeNode>();
  const { mutate: getSubclassById } = useGetSubclassById();

  const { treesNodes, setTreesNodes, setCurrentParent } = useTreesNodeStore();
  const [filterValue, setFilterValue] = useState("");
  const { data: subclassesData } = useSubclassesTree({
    classId: Number(classId),
  }, {
    enabled: !!classId,
  });

  const subclasses = useMemo(() => {
    const newDataSubclasses = transformDataSubClassesToTreeNode(subclassesData);
    return newDataSubclasses;
  }, [subclassesData]);

  useEffect(() => {
    if(subclasses){
      setTreesNodes(subclasses);
    }
  }, [setTreesNodes, subclasses]);

  const filteredTreesNodes = useMemo(() => {
    return filterTreeNodes(treesNodes, filterValue);
  }, [treesNodes, filterValue]);

  const handleAddChild = (parentItem: IItemTreeNode) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("classId", String(classId));
      params.set("parentSubclassId", String(parentItem.id));
      return params;
    });
    setCurrentParent(parentItem);
    openModal({
      title: `CREAR SUBCLASE`,
      content: <SubclasseCreateUI />,
      height: "auto",
    });
  };

  const handleAddParent = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("classId", String(classId));
      return params;
    });
    openModal({
      title: `CREAR SUBCLASE`,
      content: <SubclasseCreateUI />,
      height: "auto",
    });
  };

  const handleEditTreeNode = (node: IItemTreeNode, parentId?: number) => {
    getSubclassById(
      Number(node.id),
      {
        onSuccess: (data) => {
          setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("classId", String(classId));
            params.set("parentSubclassId", String(parentId));
            return params;
          });
          setCurrentParent(node);
          openModal({
            title: `EDITAR SUBCLASE`,
            content: <SubclasseUpdateUI subclassSelected={data} />,
            height: "auto",
          });
        },
      }
    );
  };

  const handleConfirmAction = () => {
    if (setSubclassId && itemSelected) {
      setSubclassId(itemSelected);
    }
    closeModal();
  };
  const handleCloseModal = () => {
    closeModal();
  };

  return {
    treesNodes,
    filteredTreesNodes,
    filterValue,
    setFilterValue,
    type,
    handleAddChild,
    handleAddParent,
    handleConfirmAction,
    handleCloseModal,
    handleEditTreeNode,
    itemSelected,
    setItemSelected,
  };
};
