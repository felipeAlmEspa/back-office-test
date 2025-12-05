import { ICompanyInfo } from "../Interface";

export const ItemCompany = ({ company }: { company: ICompanyInfo | undefined }) => {
  return (
    <div className="flex flex-col items-start">
      <small className="text-sm">
        {company?.businessName || "Sin razón social"}
      </small>
      <small className="text-sm font-bold">
        {company?.identification || "Sin identificación"}
      </small>
    </div>
  );
};
