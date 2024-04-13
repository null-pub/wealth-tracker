import { Store as CreateStore } from "@tanstack/store";
import { ZodSchema } from "zod";
import { Store, getDefaultStore, storeValidator } from "../models/store/current";
import { migration } from "./migrations";

const createStore = <T extends object>(validator: ZodSchema, defaultValue: T) => {
  const key = "store";
  const invalidData = "store-invalid";
  const localData = localStorage.getItem(key);
  const data = localData ? JSON.parse(localData) : defaultValue;
  const parse = validator.safeParse(data);

  if (!parse.success) {
    try {
      migration(data);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.log("error", err);
      console.log("invalid data", data);
      localStorage.setItem(invalidData, JSON.stringify(data));
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
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
