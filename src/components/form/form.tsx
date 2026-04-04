"use client";

import {
  type FormHTMLAttributes,
  useCallback,
  useContext,
  useState,
} from "react";
import { FormContext, type FormFieldValue } from "./context";

export function useForm() {
  return useContext(FormContext);
}

export function Form(props: FormHTMLAttributes<HTMLFormElement>) {
  const [data, setData] = useState<{ [name: string]: FormFieldValue }>({});
  const set = useCallback((name: string, value: FormFieldValue) => {
    setData((current) => ({ ...current, [name]: value }));
  }, []);
  return (
    <FormContext.Provider
      value={{
        set,
        data,
      }}
    >
      <form {...props} />
    </FormContext.Provider>
  );
}
