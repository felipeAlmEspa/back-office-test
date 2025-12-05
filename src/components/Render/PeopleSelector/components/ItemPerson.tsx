import { IPerson } from "@/view/Core/Maintenance/People/interfaces";

export const ItemPerson = ({ person }: { person: IPerson | undefined }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      <small className="text-sm">
        {person?.person || "No tiene identificación"}
      </small>
      <small className="text-sm font-bold">
        {person?.identification || "Sin identificación"}
      </small>
    </div>
  );
};