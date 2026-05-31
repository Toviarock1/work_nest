import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QueryError from "./QueryError";

describe("<QueryError />", () => {
  it("renders the default message + a retry button that fires onRetry", async () => {
    const onRetry = vi.fn();
    render(<QueryError onRetry={onRetry} />);

    expect(screen.getByText(/we couldn't load this/i)).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /try again/i });
    await userEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("supports a custom message", () => {
    render(<QueryError message="Nope" />);
    expect(screen.getByText("Nope")).toBeInTheDocument();
  });

  it("hides the retry button when no onRetry is provided", () => {
    render(<QueryError message="Just informing" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a compact variant with the inline retry control", async () => {
    const onRetry = vi.fn();
    render(<QueryError compact message="Inline" onRetry={onRetry} />);
    const button = screen.getByRole("button", { name: /retry/i });
    await userEvent.click(button);
    expect(onRetry).toHaveBeenCalled();
  });
});
