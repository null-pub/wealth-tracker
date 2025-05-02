import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "../shared/utility/luxon-extensions";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});
