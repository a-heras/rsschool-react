import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

const Boom = () => {
  throw new Error("Boom");
};

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>OK</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("catches errors and shows fallback UI", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(
      screen.getByText("Please reload the page or try again later.")
    ).toBeInTheDocument();

    spy.mockRestore();
  });
});