import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AboutPage } from "./AboutPage";

describe("AboutPage", () => {
    it("renders author info and RS School link", () => {
        render(
            <MemoryRouter>
                <AboutPage />
            </MemoryRouter>
        );

        expect(screen.getByText("About This App")).toBeInTheDocument();

        expect(screen.getByText(/Author: Artem/i)).toBeInTheDocument();

        expect(
            screen.getByText(/This application was created as part of the RS School React course/i)
        ).toBeInTheDocument();

        const link = screen.getByText("RS School React Course");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "https://rs.school/courses/reactjs");
        expect(link).toHaveAttribute("target", "_blank");
    });
});
