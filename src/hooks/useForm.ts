// src/hooks/useForm.ts
import { useState, useCallback } from "react";
import type { UseFormResult, FormErrors, FormTouched } from "@/types";

type ValidationRule<T> = (value: any, allValues: T) => string | undefined;
type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>;
};

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Limpar erro do campo quando o valor mudar
      if (errors[name as string]) {
        setErrors((prev) => ({
          ...prev,
          [name as string]: undefined,
        }));
      }
    },
    [errors]
  );

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name as string]: error,
    }));
  }, []);

  const setFieldTouched = useCallback(
    (name: keyof T, isTouched: boolean = true) => {
      setTouched((prev) => ({
        ...prev,
        [name as string]: isTouched,
      }));
    },
    []
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const fieldValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setValue(name as keyof T, fieldValue);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name } = e.target;
      setFieldTouched(name as keyof T, true);

      // Validar campo se houver regras
      const validationRule = validationRules[name as keyof T];
      if (validationRule) {
        const error = validationRule(values[name as keyof T], values);
        if (error) {
          setFieldError(name as keyof T, error);
        }
      }
    },
    [values, validationRules, setFieldTouched, setFieldError]
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const validationRule = validationRules[field as keyof T];
      if (validationRule) {
        const error = validationRule(values[field as keyof T], values);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFormValues,
    isValid: Object.keys(errors).length === 0,
    isDirty: Object.keys(touched).length > 0,
  };
}
