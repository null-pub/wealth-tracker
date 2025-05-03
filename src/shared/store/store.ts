import { Store as CreateStore } from "@tanstack/store";
import { ZodSchema } from "zod";
import { Store, getDefaultStore, storeValidator } from "../models/store/current";
import { migration } from "./migrations";

const jsonTryParse = (data?: string | null): { result: unknown; isSuccess: boolean } => {
  if (!data) {
    return { result: data, isSuccess: false };
  }
  try {
    return { result: JSON.parse(data), isSuccess: true };
  } catch {
    return { result: data, isSuccess: false };
  }
};

export const createStore = <T extends object>(validator: ZodSchema<unknown>, defaultValue: T) => {
  const key = "store";
  const invalidData = "store-invalid";
  const localData = localStorage.getItem(key);
  const { result: parsedData, isSuccess } = jsonTryParse(localData);
  const data = isSuccess ? parsedData : defaultValue;
  const parse = validator.safeParse(data);

  if (!parse.success) {
    try {
      migration(data);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.log("error", err);
      console.log("invalid data", data);
      if (localData !== null) {
        localStorage.setItem(invalidData, localData);
      }
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
  }

  const store = new CreateStore<T>(data as T);
  store.subscribe(() => {
    const current = localStorage.getItem(key);
    current && localStorage.setItem(`${key}-previous`, current);
    localStorage.setItem(key, JSON.stringify(store.state));
  });

  return store;
};

export const store = createStore<Store>(storeValidator, getDefaultStore());
