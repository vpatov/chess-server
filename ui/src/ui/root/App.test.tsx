import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { store } from "../../store/store";
import { Provider } from "react-redux";

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

test("board is present", () => {
  const { container } = render(<AppWrapper />);
  const board = container.querySelector(".board");
  expect(board).toBeInTheDocument();
});
