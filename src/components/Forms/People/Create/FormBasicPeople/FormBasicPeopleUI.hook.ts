import { rqMsg } from "@/helper";
import { IBasicPeopleCreateRequest } from "@/view/Core/Maintenance/People/interfaces";
import { z } from "zod";
import { useForm, UseFormReturn, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDataType } from "@/interface";
import { useErrorFormulario } from "@/hooks/useErrorNotification";
import { useZodErrorParser } from "@/utils/zodErrorParser";
import { useCallback, useEffect, useMemo } from "react";
import { getValidateIdentification } from "@/services/people/people.service";
import { useGetCountries } from "@/services/catalogs/catalog.service";
import { useCatalogs } from "@/hooks/useCatalogs";

const schema = z
  .object({
    identificationTypeId: z.number({ error: rqMsg("Tipo de identificación") }),
    identification: z.string({ error: rqMsg("Número de identificación") }),
    naturalPersonData: z
      .object({
        names: z.string({ error: rqMsg("Nombres") }).min(3, rqMsg("Nombres")).toUpperCase().trim(),
        lastNames: z
          .string({ error: rqMsg("Apellidos") })
          .min(3, rqMsg("Apellidos")).toUpperCase().trim(),
        genderId: z.number({ error: rqMsg("Género") }),
        civilStatusId: z.number({ error: rqMsg("Estado civil") }),
        birthCountryId: z.number({ error: rqMsg("País de nacimiento") }),
      })
      .optional(),
    legalPersonData: z
      .object({
        companyName: z
          .string({ error: rqMsg("Nombre comercial") })
          .min(3, rqMsg("Nombre comercial")).toUpperCase().trim(),
        socialReason: z
          .string({ error: rqMsg("Razón social") })
          .min(3, rqMsg("Razón social")).toUpperCase().trim(),
      })
      .optional(),
    emailData: z
      .array(
        z.object({
          emailTypeId: z.number({ error: rqMsg("Tipo de email") }),
          email: z.string().min(6, rqMsg("Email")),
          primary: z.boolean(),
        })
      )
      .refine((data) => data.find((item) => item.primary === true), {
        message: "Debe haber al menos un email marcada como primaria",
        path: ["primary"],
      }),
    directionData: z
      .array(
        z.object({
          addressTypeId: z.number({ error: rqMsg("Tipo de dirección") }),
          primaryStreet: z.string({ error: rqMsg("Calle principal") }).toUpperCase().trim(),
          cantonId: z.number({ error: rqMsg("Cantón") }),
        })
      ),
    phoneData: z
      .array(
        z.object({
          phoneTypeId: z.number({ error: rqMsg("Tipo de teléfono") }),
          phoneNumber: z.string({ error: rqMsg("Número de teléfono") }),
          primary: z.boolean({ error: rqMsg("Primario") }).catch(false),
        })
      )
      .refine((data) => data.find((item) => item.primary === true), {
        message: "Debe haber al menos un teléfono marcada como primaria",
        path: ["primary"],
      }),
  })
  .superRefine((data, ctx) => {
    if (data.identificationTypeId === 1 && !data.naturalPersonData) {
      ctx.addIssue({
        path: ["naturalPersonData"],
        code: "custom",
        message: rqMsg("Datos de persona natural son requeridos"),
      });
    }
    if (data.identificationTypeId === 2 && !data.legalPersonData) {
      ctx.addIssue({
        path: ["legalPersonData"],
        code: "custom",
        message: rqMsg("Datos de persona jurídica son requeridos"),
      });
    }
  });

export interface FormBasicPeopleUIHookProps {
  methods: UseFormReturn<IBasicPeopleCreateRequest>;
  typesIdentifications: IDataType[];
  typesGender: IDataType[];
  isLoadingTypesGender: boolean;
  isLoadingTypesIdentifications: boolean;
  typesCivilStatus: IDataType[];
  isLoadingTypesCivilStatus: boolean;
  typesIdentificationSelect: string;
  countries: IDataType[];
  isValidForm?: boolean;
  directionData: IBasicPeopleCreateRequest["directionData"];
  emailData: IBasicPeopleCreateRequest["emailData"];
  phoneData: IBasicPeopleCreateRequest["phoneData"];
  typesAddress: IDataType[];
  isLoadingTypesAddress: boolean;
  typesEmail: IDataType[];
  isLoadingTypesEmail: boolean;
  typesPhone: IDataType[];
  isLoadingTypesPhone: boolean;
  handleFormSubmit: () => void;
  errorFormMessage: (errors: FieldErrors) => void;
  formatAllErrors: () => string;
  handleCantonChange: (cantonId: number) => void;
}

export const useFormBasicPeopleUI = (): FormBasicPeopleUIHookProps => {
  const { formatErrors } = useZodErrorParser();

  const methods = useForm<IBasicPeopleCreateRequest>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      emailData: [
        {
          primary: true,
        },
      ],
      phoneData: [
        {
          primary: true,
        },
      ],
      directionData: [
        {
          addressTypeId: 0,
          primaryStreet: "",
          cantonId: 0,
        },
      ],
    },
  });

  const {
    watch,
    setValue,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    getFieldState,
    formState: { errors },
  } = methods;
  const { errorFormMessage } = useErrorFormulario();
  const { listTypesAddress, isLoadingTypesAddress } = useCatalogs();
  const { listTypesIdentifications, isLoadingTypesIdentifications } = useCatalogs();
  const { listTypesGender, isLoadingTypesGender } = useCatalogs();
  const { listTypesCivilStatus, isLoadingTypesCivilStatus } = useCatalogs();
  const { listTypesEmail, isLoadingTypesEmail } = useCatalogs();
  const { listTypesPhone, isLoadingTypesPhone } = useCatalogs();
  const { data: countries } = useGetCountries();

  const identification = watch("identification");
  const identificationTypeId = watch("identificationTypeId");
  const directionData = watch("directionData");
  const emailData = watch("emailData");
  const phoneData = watch("phoneData");

  const onSubmit = useCallback(() => {
    console.log(getValues());
  }, [getValues]);

  const typesIdentificationSelect = useMemo(() => {
    const type = listTypesIdentifications?.find(
      (type) => type.value === identificationTypeId
    );
    return type?.code ?? "";
  }, [identificationTypeId, listTypesIdentifications]);

  const countriesMap: IDataType[] = useMemo(() => {
    if (!countries) return [];
    return countries.map((country) => ({
      ...country,
      code: country.code,
    }));
  }, [countries]);

  const validateIdentification = useCallback(async () => {
    if (!identification) return;
    const result = await getValidateIdentification(
      identification,
      typesIdentificationSelect
    );
    if (result) {
      setError("identification", {
        type: "manual",
        message: result,
      });
    } else {
      clearErrors("identification");
    }
  }, [identification, setError, clearErrors, typesIdentificationSelect]);

  useEffect(() => {
    validateIdentification();
  }, [validateIdentification]);

  useEffect(() => {
    clearErrors();  
    if (typesIdentificationSelect === "TD062") {
      setValue("naturalPersonData", undefined);
    }
    if (
      typesIdentificationSelect === "TD063" ||
      typesIdentificationSelect === "TD064"
    ) {
      setValue("legalPersonData", undefined);
    }
  }, [typesIdentificationSelect, setValue, getFieldState, clearErrors]);

  const handleFormSubmit = useCallback(() => {
    if (Object.keys(errors).length > 0) {
      errorFormMessage(errors);
      return;
    }
    handleSubmit(onSubmit, errorFormMessage)();
  }, [errorFormMessage, errors, handleSubmit, onSubmit]);

  const handleCantonChange = useCallback(
    (cantonId: number) => {
      setValue("directionData.0.cantonId", cantonId);
    },
    [setValue]
  );

  const formatAllErrors = (): string => {
    const formErrors = methods.formState.errors;
    return formatErrors(formErrors);
  };

  return {
    methods,
    typesIdentifications: listTypesIdentifications,
    typesGender: listTypesGender,
    typesCivilStatus: listTypesCivilStatus,
    isLoadingTypesIdentifications,
    isLoadingTypesCivilStatus,
    isLoadingTypesGender,
    isLoadingTypesAddress,
    isLoadingTypesEmail,
    isLoadingTypesPhone,
    typesIdentificationSelect,
    countries: countriesMap,
    typesAddress: listTypesAddress,
    typesEmail: listTypesEmail,
    typesPhone: listTypesPhone,
    directionData,
    emailData,
    phoneData,
    errorFormMessage,
    formatAllErrors,
    handleFormSubmit,
    handleCantonChange,
  };
};
