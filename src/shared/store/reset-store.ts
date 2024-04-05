import { getDefaultStore } from "shared/models/store";
import { store } from "./store";

export const resetStore = () => store.setState(() => getDefaultStore());
