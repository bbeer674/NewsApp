import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Home from "./src/pages/Home";
import NewsService from "./src/services/newsService";
import React from "react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
  i18n: {
    changeLanguage: vi.fn(() => Promise.resolve()),
    language: "en",
    languages: ["en", "zh"],
    services: {
      languageUtils: {
        toResolveHierarchy: vi.fn(() => ["en", "zh"]),
      },
    },
  },
}));

vi.spyOn(NewsService, "getNewsTop").mockResolvedValue([]);
vi.spyOn(NewsService, "getNewsSearch").mockResolvedValue([]);

describe("Home Component", () => {
  test("renders the Home component", () => {
    render(<Home />);
    expect(screen.getByText("News")).toBeInTheDocument();
  });

  test("updates search input value", () => {
    render(<Home />);
    const searchInput = screen.getByPlaceholderText(
      "search"
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "Technology" } });

    expect(searchInput.value).toBe("Technology");
  });

  test("calls onChangeLanguage when selecting a language", () => {
    render(<Home />);
    const languageSelect = screen.getAllByRole(
      "combobox"
    )[0] as HTMLSelectElement;

    fireEvent.change(languageSelect, { target: { value: "zh" } });

    expect(languageSelect.value).toBe("zh");
  });

  test("calls handleSearch when search button is clicked", async () => {
    render(<Home />);
    const searchButton = screen.getByText("search");

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(NewsService.getNewsSearch).toHaveBeenCalled();
    });
  });

  test("pagination next button works", async () => {
    render(<Home />);

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      console.log(
        "All buttons:",
        buttons.map((btn) => btn.textContent)
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("→"))
      ).toBeInTheDocument();
    });

    const nextPageButton = screen.getByText((content) => content.includes("→"));
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(nextPageButton).not.toBeDisabled();
    });
  });
});
