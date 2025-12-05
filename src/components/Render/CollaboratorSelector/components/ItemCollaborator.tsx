import { ICollaborator } from "@/view/Wholesale/interfaces";

export const ItemCollaborator = ({ collaborator }: { collaborator: ICollaborator | undefined }) => {
  return (
    <div className="flex flex-col items-start">
      <small className="text-sm font-semibold">{collaborator?.collaborator ?? "Sin nombre"}</small>
      <small className="text-xs text-gray-500">{collaborator?.identification ?? "Sin identificación"}</small>
      {collaborator?.agencyName && (
        <small className="text-xs text-gray-400">{collaborator.agencyName}</small>
      )}
    </div>
  );
};
