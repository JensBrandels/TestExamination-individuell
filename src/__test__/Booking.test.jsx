import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Booking from "../views/Booking.jsx";
import { BrowserRouter } from "react-router-dom";

describe("Booking", () => {
  it("should NOT be able to reserve 1 lane for 5 or more players", async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "12:30" },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "5" },
    });

    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" },
    });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole("button", { name: "+" }));

      const shoe = screen.getByLabelText(`Shoe size / person ${i + 1}`);
      fireEvent.change(shoe, { target: { value: "40" } });
    }

    fireEvent.click(screen.getByText(/strIIIIIike!/i));

    expect(
      await screen.findByText(/Det får max vara 4 spelare per bana/i)
    ).toBeInTheDocument();
  });

  it("should test if we get the correct error when user don't fill in any of the forms", async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/strIIIIIike!/i));

    expect(
      await screen.findByText(/Alla fälten måste vara ifyllda/i)
    ).toBeInTheDocument();
  });

  it("should show an error message if at least 1 out of x amount of players forgot to add shoe size", async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "12:30" },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" },
    });

    //Adding two players shoes
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));

    //enter shoe sizes for each player
    const shoe1 = screen.getByLabelText("Shoe size / person 1");
    const shoe2 = screen.getByLabelText("Shoe size / person 2");

    fireEvent.change(shoe1, { target: { value: "45" } }); //shoesize valid
    fireEvent.change(shoe2, { target: { value: "" } }); //shoesize invalid

    fireEvent.click(screen.getByText(/strIIIIIike!/i));

    expect(
      await screen.findByText(/Alla skor måste vara ifyllda/i)
    ).toBeInTheDocument();
  });

  it("should show an error message if players and shoeamount is odd", async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "12:30" },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "+" }));

    const shoe1 = screen.getByLabelText("Shoe size / person 1");

    fireEvent.change(shoe1, { target: { value: "45" } }); //shoesize valid

    fireEvent.click(screen.getByText(/strIIIIIike!/i));

    expect(
      await screen.findByText(
        /Antalet skor måste stämma överens med antal spelare/i
      )
    ).toBeInTheDocument();
  });

  it("should be able to delete chosen field for shoes by clicking on - button for every player", async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "12:30" },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));

    //make sure i have 3 shoe size fields being rendered
    const shoeFields = screen.getAllByLabelText(/Shoe size \/ person/i);
    expect(shoeFields).toHaveLength(3);

    //giving shoes to the first 2
    fireEvent.change(shoeFields[0], { target: { value: "45" } });
    fireEvent.change(shoeFields[1], { target: { value: "32" } });

    //here we check for third shoe that should be here at this moment
    expect(shoeFields[2]).toBeInTheDocument();

    //simulate clicking to remove the shoe on index 2
    fireEvent.click(screen.getAllByRole("button", { name: "-" })[2]);

    const updatedShoeFields =
      screen.queryAllByLabelText(/Shoe size \/ person/i);
    expect(updatedShoeFields).toHaveLength(2);

    expect(
      screen.queryByLabelText(/Shoe size \/ person 3/i)
    ).not.toBeInTheDocument();
  });

  it("should test navigation", async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const images = screen.getAllByRole("img");
    const navIcon = images.find((img) =>
      img.classList.contains("navigation__icon")
    );

    fireEvent.click(navIcon);

    const bookingLink = await screen.findByRole("link", { name: /Booking/i });
    const confirmationLink = await screen.findByRole("link", {
      name: /Confirmation/i,
    });

    expect(bookingLink).toBeInTheDocument();
    expect(confirmationLink).toBeInTheDocument();

    fireEvent.click(confirmationLink);

    waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Sweet, let's go!" })
      ).toBeInTheDocument();
    });
  });
});
