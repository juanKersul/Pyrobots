import { render, screen } from "@testing-library/react";
import Partida from "../Partida/Partida.js";

describe("Partida", () => {
  it("renders appropriately", () => {
    render(<Partida />);
    expect(screen.getByText(/Privado/i)).toBeInTheDocument();
  });
});
