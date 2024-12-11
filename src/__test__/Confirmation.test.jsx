import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Confirmation from "../views/Confirmation.jsx";
import Booking from "../views/Booking.jsx";
import { BrowserRouter } from "react-router-dom";

describe("confirmation", () => {
  it("should imitate adding a booking and how it renders on page by adding to sessionStorage", async () => {
    sessionStorage.clear();
    const mockConfirmationData = {
      when: "2025-01-01T02:10",
      lanes: 1,
      people: 2,
      id: "STR3668MHPA",
      price: 340,
    };

    //Mock sessionStorage before rendering
    sessionStorage.setItem(
      "confirmation",
      JSON.stringify(mockConfirmationData)
    );

    //Render the Confirmation component with the BrowserRouter context
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    //Check if the "See you soon!" title is rendered (indicating the component has loaded)
    await screen.findByText(/See you soon!/i);

    const whenInput = screen.getByLabelText("When");
    const whoInput = screen.getByLabelText("Who");
    const lanesInput = screen.getByLabelText("Lanes");
    const bookingNumber = screen.getByLabelText("Booking number");

    expect(whenInput).toHaveValue("2025-01-01 02:10");
    expect(whoInput).toHaveValue("2");
    expect(lanesInput).toHaveValue("1");
    expect(bookingNumber).toHaveValue("STR3668MHPA");

    const totalText = screen.getByText("Total:");
    expect(totalText).toBeInTheDocument();
    const price = screen.getByText("340 sek", { exact: false });
    expect(price).toBeInTheDocument();

    //Check if sessionStorage contains the expected data
    const storedData = JSON.parse(sessionStorage.getItem("confirmation"));

    expect(storedData.when).toBe(mockConfirmationData.when);
    expect(storedData.lanes).toBe(mockConfirmationData.lanes);
    expect(storedData.people).toBe(mockConfirmationData.people);
    expect(storedData.id).toBe(mockConfirmationData.id);
    expect(storedData.price).toBe(mockConfirmationData.price);
  });

  it("should navigate from Booking to Confirmation", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/When, WHAT & Who/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "12:30" },
    });
    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Number of lanes/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));

    const shoe1 = screen.getByLabelText("Shoe size / person 1");
    const shoe2 = screen.getByLabelText("Shoe size / person 2");

    fireEvent.change(shoe1, { target: { value: "45" } });
    fireEvent.change(shoe2, { target: { value: "45" } });

    const strikeButton = screen.getByRole("button", { name: /strIIIIIike!/i });
    fireEvent.click(strikeButton);

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("button", { name: "Sweet, let's go!" })
    ).toBeInTheDocument();
  });

  it("Should navigate to /confirmation without anything in sessionStorage and render 'Ingen bokning gjord visas'", () => {
    sessionStorage.clear();
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );
    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  });
});
