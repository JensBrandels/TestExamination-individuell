import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App.jsx";

describe("Render app for funzies", () => {
  it("simulates user interactions for booking with at least 1 person", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "12:30" },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" },
    });

    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole("button", { name: "+" }));

      const shoe = screen.getByLabelText(`Shoe size / person ${i + 1}`);
      fireEvent.change(shoe, { target: { value: "40" } });
    }
    const button = screen.getByText(/strIIIIIike!/i);

    await waitFor(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText(/See you soon/i)).toBeInTheDocument();
    });
  });
});
