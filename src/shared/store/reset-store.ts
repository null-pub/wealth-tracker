import { getDefaultStore } from "shared/models/store/current";
import { store } from "./store";

export const resetStore = () => store.setState(() => getDefaultStore());
