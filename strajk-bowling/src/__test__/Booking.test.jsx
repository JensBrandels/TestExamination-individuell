import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Booking from "../views/Booking.jsx";
import { BrowserRouter } from "react-router-dom";

describe("Booking", () => {
  it("Should render the booking page", () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );
  });
});
