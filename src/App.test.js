import { render } from "@testing-library/react";

import App from "./App";

describe("App component", () => {
  const { container } = render(<App />, { container: document.createElement("div") });
  const parent = container.querySelector(".scroll-app");
  expect(parent).not.toBeNull();
});
