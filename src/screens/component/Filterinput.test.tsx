import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filterinput from "./Filterinput";

describe("Filterinput Component", () => {
  const mockSortData = jest.fn();
  const mockFilterData = jest.fn();
  const mockId = "column1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders fieldname text correctly", () => {
    render(
      <table>
        <thead>
          <tr>
            <Filterinput
              fieldname="Name"
              sortdata={mockSortData}
              filterdata={mockFilterData}
              id={mockId}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("calls sortdata function when sort icon is clicked", () => {
    render(
      <table>
        <thead>
          <tr>
            <Filterinput
              fieldname="Age"
              sortdata={mockSortData}
              filterdata={mockFilterData}
              id={mockId}
            />
          </tr>
        </thead>
      </table>
    );

   const sortIcon = document.querySelector(".ti-sort-ascending");
fireEvent.click(sortIcon!);

    expect(mockSortData).toHaveBeenCalledTimes(1);
    expect(mockSortData).toHaveBeenCalledWith(expect.any(Object), mockId);
  });

  it("calls filterdata function when typing in input", () => {
    render(
      <table>
        <thead>
          <tr>
            <Filterinput
              fieldname="City"
              sortdata={mockSortData}
              filterdata={mockFilterData}
              id={mockId}
            />
          </tr>
        </thead>
      </table>
    );

    const input = screen.getByRole("textbox");
    fireEvent.keyUp(input, { target: { value: "Delhi" } });

    expect(mockFilterData).toHaveBeenCalledTimes(1);
    expect(mockFilterData).toHaveBeenCalledWith(mockId, "Delhi");
  });
});
