import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("returns initial value when key is missing", () => {
        const { result } = renderHook(() =>
            useLocalStorage("searchTerm", "")
        );

        expect(result.current[0]).toBe("");
    });

    it("reads existing value from localStorage on init", () => {
        localStorage.setItem("searchTerm", "saved");

        const { result } = renderHook(() =>
            useLocalStorage("searchTerm", "")
        );

        expect(result.current[0]).toBe("saved");
    });

    it("updates state and localStorage when setValue is called", () => {
        const { result } = renderHook(() =>
            useLocalStorage("searchTerm", "")
        );

        act(() => {
            result.current[1]("hello");
        });

        expect(result.current[0]).toBe("hello");
        expect(localStorage.getItem("searchTerm")).toBe("hello");
    });
});
