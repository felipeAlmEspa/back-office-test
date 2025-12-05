import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { usePeopleExists } from "@/services/people/people.service";
import { IPeopleExistsResponse } from "@/view/Core/Maintenance/People/interfaces";
//import { cleanObject } from "@itsa-develop/itsa-fe-components";
import { useState } from "react";

export interface PersonSearchUIHookProps {
  //personIdentificationSearch: string;
  personExists?: IPeopleExistsResponse;
  onChangePersonIdentificationSearch?: (value: string) => void;
  isLoading?: boolean;
};


export const usePersonSearchUI = (): PersonSearchUIHookProps => {

  const [personIdentificationSearch, setPersonIdentificationSearch] = useState<string>("");

  const {data: personExists, isLoading} = usePeopleExists({
    identification: personIdentificationSearch,
  });

  const { debouncedCallback: debouncedPersonIdentificationSearch, isLoading: isSearching } =
    useDebouncedCallback(
      (value: string) => {
        setPersonIdentificationSearch(value);
      },
      500,
      { enableLoading: true }
    );

  return {
    personExists: personExists,
    onChangePersonIdentificationSearch: debouncedPersonIdentificationSearch,
    isLoading: isLoading || isSearching,
  };
};