import { ICatalog, IDataType } from "@/interface";
import {
  useGetTypesActEconomical,
} from "@/services/catalogs/catalog.service";
import { useDataTypes } from "@/services/dataTypes/dataType.service";

export interface ICatalogs {
  listTypesAddress: IDataType[];
  isLoadingTypesAddress: boolean;
  listTypesIdentifications: IDataType[];
  isLoadingTypesIdentifications: boolean;
  listTypesGender: IDataType[];
  isLoadingTypesGender: boolean;
  listTypesCivilStatus: IDataType[];
  isLoadingTypesCivilStatus: boolean;
  listTypesEmail: IDataType[];
  isLoadingTypesEmail: boolean;
  listTypesPhone: IDataType[];
  isLoadingTypesPhone: boolean;
  listTypesActEconomical: ICatalog[];
  isLoadingTypesActEconomical: boolean;
  isLoading: boolean;
  listTypesClients: IDataType[];
  isLoadingTypesClients: boolean;
  listTypesSuppliers: IDataType[];
  isLoadingTypesSuppliers: boolean;
  listTypesContributors: IDataType[];
  isLoadingTypesContributors: boolean;
}

export const useCatalogs = () => {
  const { data: typesAddress, isLoading: isLoadingTypesAddress } = useDataTypes(
    { codeType: "NUC012" }
  );
  const {
    data: typesIdentifications,
    isLoading: isLoadingTypesIdentifications,
  } = useDataTypes({ codeType: "NUC006" });
  const { data: typesGender, isLoading: isLoadingTypesGender } = useDataTypes({
    codeType: "NUC008",
  });
  const { data: typesCivilStatus, isLoading: isLoadingTypesCivilStatus } =
    useDataTypes({ codeType: "NUC007" });
  const { data: typesEmail, isLoading: isLoadingTypesEmail } = useDataTypes({
    codeType: "NUC010",
  });
  const { data: typesPhone, isLoading: isLoadingTypesPhone } = useDataTypes({
    codeType: "NUC011",
  });
  const {
    data: typesSuppliers,
    isLoading: isLoadingTypesSuppliers,
  } = useDataTypes({
    codeType: "NUC013",
  });
    const { data: typesContributors, isLoading: isLoadingTypesContributors } =
      useDataTypes({
        codeType: "NUC018",
      });

  const { data: typesActEconomical, isLoading: isLoadingTypesActEconomical } =
    useGetTypesActEconomical();

  const listTypesAddress = typesAddress || [];
  const listTypesIdentifications = typesIdentifications || [];
  const listTypesGender = typesGender || [];
  const listTypesCivilStatus = typesCivilStatus || [];
  const listTypesEmail = typesEmail || [];
  const listTypesPhone = typesPhone || [];
  const listTypesSuppliers = typesSuppliers || [];
  const listTypesActEconomical = typesActEconomical || [];
  const listTypesContributors = typesContributors || [];
  const isLoading =
    isLoadingTypesAddress ||
    isLoadingTypesIdentifications ||
    isLoadingTypesGender ||
    isLoadingTypesCivilStatus ||
    isLoadingTypesEmail ||
    isLoadingTypesPhone ||
    isLoadingTypesSuppliers ||
    isLoadingTypesActEconomical ||
    isLoadingTypesContributors;

  return {
    listTypesAddress,
    isLoadingTypesAddress,
    listTypesIdentifications,
    isLoadingTypesIdentifications,
    listTypesGender,
    isLoadingTypesGender,
    listTypesCivilStatus,
    isLoadingTypesCivilStatus,
    listTypesEmail,
    isLoadingTypesEmail,
    listTypesPhone,
    isLoadingTypesPhone,
    listTypesSuppliers,
    isLoadingTypesSuppliers,
    listTypesActEconomical,
    isLoadingTypesActEconomical,
    isLoading,
    listTypesContributors,
    isLoadingTypesContributors,
  };
};
