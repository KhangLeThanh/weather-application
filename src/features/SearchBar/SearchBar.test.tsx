import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";
import * as weatherApi from "../../api/weatherApi";

vi.mock("../../api/weatherApi");

const mockOnSelect = vi.fn();

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with placeholder", () => {
    render(<SearchBar onSelect={mockOnSelect} />);
    expect(
      screen.getByPlaceholderText("Search for a city...")
    ).toBeInTheDocument();
  });

  it("renders custom placeholder", () => {
    render(<SearchBar onSelect={mockOnSelect} placeholder="Find a city" />);
    expect(screen.getByPlaceholderText("Find a city")).toBeInTheDocument();
  });

  it("shows clear button when query is typed", async () => {
    render(<SearchBar onSelect={mockOnSelect} />);
    await userEvent.type(screen.getByRole("textbox"), "Helsinki");
    expect(screen.getByLabelText("Clear")).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    render(<SearchBar onSelect={mockOnSelect} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Helsinki");
    await userEvent.click(screen.getByLabelText("Clear"));
    expect(input).toHaveValue("");
  });

  it("shows dropdown results after typing", async () => {
    vi.spyOn(weatherApi, "searchLocations").mockResolvedValue([
      {
        name: "Helsinki",
        country: "Finland",
        latitude: 60.17,
        longitude: 24.94,
      },
    ]);

    render(<SearchBar onSelect={mockOnSelect} />);
    await userEvent.type(screen.getByRole("textbox"), "Helsinki");

    await waitFor(() => {
      expect(screen.getByText("Helsinki")).toBeInTheDocument();
      expect(screen.getByText("Finland")).toBeInTheDocument();
    });
  });

  it("calls onSelect when a result is clicked", async () => {
    const mockLocation = {
      name: "Helsinki",
      country: "Finland",
      latitude: 60.17,
      longitude: 24.94,
    };
    vi.spyOn(weatherApi, "searchLocations").mockResolvedValue([mockLocation]);

    render(<SearchBar onSelect={mockOnSelect} />);
    await userEvent.type(screen.getByRole("textbox"), "Helsinki");

    await waitFor(() => screen.getByText("Helsinki"));
    await userEvent.click(screen.getByText("Helsinki"));

    expect(mockOnSelect).toHaveBeenCalledWith(mockLocation);
  });
});
