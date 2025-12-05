import { FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { PersonCreateUIView } from "@/view/Core/Maintenance/People/create/PersonCreateUI.view";
import { usePersonCreateUI } from "@/view/Core/Maintenance/People/create/PersonCreateUI.hook";
import { Button, FormLabelError, cleanObject } from "@itsa-develop/itsa-fe-components";
import { useCreatePerson } from "@/services/people/people.service";
import { IPeopleExistsResponse } from "@/view/Core/Maintenance/People/interfaces";

interface SpouseCreateModalProps {
  onSuccess: (person: IPeopleExistsResponse) => void;
  onCancel: () => void;
  initialParentIdentification?: string;
  initialParentIdentificationTypeId?: number;
  omitIdentification?: string;
}

export const SpouseCreateModal = ({
  onSuccess,
  onCancel,
  initialParentIdentification,
  initialParentIdentificationTypeId,
  omitIdentification,
}: SpouseCreateModalProps) => {
  const personHook = usePersonCreateUI();
  const identificationForm = personHook.methods.watch("identification");
  const { mutate: createPerson, isPending } = useCreatePerson();
  const { methods, typesCivilStatus, typesIdentification } = personHook;

  useEffect(() => {
    if (typesCivilStatus && typesCivilStatus.length > 0) {
      const married = typesCivilStatus.find((t) => t.code === "TD066");
      if (married)
        methods.setValue("naturalPersonData.civilStatusId", married.value);
    }

    if (typesIdentification && typesIdentification.length > 0) {
      const allowedCodes = ["TD063", "TD064"];
      const parentType = typesIdentification.find(
        (t) => t.value === initialParentIdentificationTypeId
      );
      if (parentType && allowedCodes.includes(parentType.code)) {
        methods.setValue("identificationTypeId", parentType.value);
      } else {
        const defaultType = typesIdentification.find(
          (t) => t.code === "TD063" || t.code === "TD064"
        );
        if (defaultType)
          methods.setValue("identificationTypeId", defaultType.value);
      }
    }

    if (initialParentIdentification) {
      // prefill the spouse search input inside the create modal with the main person's identification
      methods.setValue("naturalPersonData.spouseIdentificationId", undefined);
      methods.setValue("identification", "");
    }
  }, [
    methods,
    typesCivilStatus,
    typesIdentification,
    initialParentIdentification,
    initialParentIdentificationTypeId,
  ]);

  const handleSubmit = async () => {
    const isValid = await personHook.methods.trigger();

    if (!isValid) {
      const errors = personHook.methods.formState.errors;
      personHook.errorFormMessage(errors);
      return;
    }

    const personData = personHook.methods.getValues();

    if (personData.naturalPersonData) {
      personData.naturalPersonData = {
        ...personData.naturalPersonData,
        isVerifiedCivilRegistry: true,
      };
    }

    if (personData.directionData && personData.directionData.length > 0) {
      personData.directionData = personData.directionData.map((dir) => {
        const dirCopy = { ...dir };
        // @ts-expect-error - TODO: Esto quedo en duda falta en el componente
        delete dirCopy.primary;
        return dirCopy;
      });
    }

    const { ...personDataWithoutCatalog } = personData;

    // const payloadSnakeCase = humps.decamelizeKeys(personDataWithoutCatalog);

    const newDataCreatePerson = {
      ...personDataWithoutCatalog,
      naturalPersonData: {
        ...personDataWithoutCatalog.naturalPersonData,
        birthProvinceId: undefined,
      },
    };
    const clearData = cleanObject(newDataCreatePerson);

    createPerson(clearData, {
      onSuccess: (data: unknown) => {
        const personName = personData.naturalPersonData
          ? `${personData.naturalPersonData.names} ${personData.naturalPersonData.lastNames}`
          : personData.legalPersonData?.companyName || "Persona creada";

        const backendResponse = data as {
          id?: number;
          person_id?: number;
          personId?: number;
        };
        const personResponse: IPeopleExistsResponse = {
          id:
            backendResponse.id ||
            backendResponse.person_id ||
            backendResponse.personId ||
            0,
          identification: personData.identification,
          identificationTypeId: personData.identificationTypeId,
          person: personName,
        };

        // personHook.openNotificationWithIcon({
        //   type: "success",
        //   message: "Persona creada exitosamente",
        //   description: `${personName} ha sido creado correctamente`,
        // });
        onSuccess(personResponse);
      },
      onError: (error: unknown) => {
        const axiosError = error as {
          response?: { data?: { message?: string; details?: string } };
          message?: string;
        };
        personHook.openNotificationWithIcon({
          type: "error",
          message: "Error al crear persona",
          description:
            axiosError?.response?.data?.details ||
            axiosError?.response?.data?.message ||
            axiosError?.message ||
            "Error desconocido",
        });
      },
    });
  };

  // console.log("identificationForm =>", identificationForm, omitIdentification);

  return (
    <FormProvider {...personHook.methods}>
      <div className="flex flex-col gap-4">
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <PersonCreateUIView
            {...personHook}
            initialSpouseIdentification={initialParentIdentification}
            allowedIdentificationCodes={["TD063", "TD064"]}
            isSpouseCreation={true}
          />
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
          {identificationForm === omitIdentification && (
            <div>
              <FormLabelError label="No puedes ingresar la misma identificación de la persona principal" />
            </div>
          )}
          <div className="flex justify-end gap-2 ">
            <Button
              type="secondary"
              label="Cancelar"
              onClick={onCancel}
              disabled={isPending}
              size="middle"
            />
            <Button
              size="middle"
              type="primary"
              label="Guardar"
              onClick={handleSubmit}
              loading={isPending}
              disabled={identificationForm === omitIdentification}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
