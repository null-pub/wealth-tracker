import { Store as CreateStore } from "@tanstack/store";
import { ZodSchema } from "zod";
import { Store, getDefaultStore, storeValidator } from "../models/store";

const createStore = <T extends object>(validator: ZodSchema, defaultValue: T) => {
  const key = "store";
  const invalidData = "store-invalid";
  const localData = localStorage.getItem(key);
  const data = localData ? JSON.parse(localData) : defaultValue;
  const parse = validator.safeParse(data);

  //todo create migration process
  if (!parse.success) {
    console.log("zod error", parse.error);
    console.log("original", data);
    localStorage.setItem(invalidData, JSON.stringify(data));
    localStorage.setItem(key, JSON.stringify(defaultValue));
  }

  const store = new CreateStore<T>(data);
  store.subscribe(() => {
    const current = localStorage.getItem(key);
    current && localStorage.setItem(`${key}-previous`, current);
    localStorage.setItem(key, JSON.stringify(store.state));
  });

  return store;
};

export const store = createStore<Store>(storeValidator, getDefaultStore());
