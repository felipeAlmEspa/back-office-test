import { Button, FormLabel, Input, TreeNode } from "@itsa-develop/itsa-fe-components";
import { ITreeNodeClassSubclassUIHook } from "./TreeNodeClassSubclassUI.hook";

export const TreeNodeClassSubclassUIView = ({
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
}: ITreeNodeClassSubclassUIHook) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2">
        <Input
          type="text"
          placeholder="Buscar subclase"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        {type === "CRUD" && (
          <Button
            type="primary"
            size="middle"
            onClick={handleAddParent}
            label="Agregar subclase"
          />
        )}
      </div>
      <div className="h-72 overflow-y-auto">
        <TreeNode
          type={type}
          items={filteredTreesNodes}
          onEdit={handleEditTreeNode}
          onAddChild={handleAddChild}
          onSelectNode={(item) => setItemSelected(item)}
        />
      </div>
      {itemSelected && type === "SELECT" && (
        <div className="flex flex-col p-2">
          <FormLabel label="Item Seleccionado" />
          <div className="border-2 border-gray-75 rounded-md p-2">
            <span>{itemSelected.name}</span>
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2">
        {type === "SELECT" && (
          <Button
            type="secondary"
            size="middle"
            onClick={handleCloseModal}
            label="Cancelar"
          />
        )}
        <Button
          type="primary"
          size="middle"
          onClick={handleConfirmAction}
          label="Aceptar"
        />
      </div>
    </div>
  );
};
