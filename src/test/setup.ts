import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock(/\.module\.scss$/, () => ({
  default: new Proxy({}, { get: (_, key) => String(key) }),
}));
