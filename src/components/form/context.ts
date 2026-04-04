import { createContext } from "react";

export type FormFieldValue = boolean | number | string | FormFieldValue[];

export const FormContext = createContext<{
  set(name: string, value?: FormFieldValue | null): void;
  data: { [name: string]: FormFieldValue | null | undefined };
}>({
  set() {
    throw new Error("Missing provider");
  },
  data: {},
});
