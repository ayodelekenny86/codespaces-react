import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cart from "./Cart";

test("shows the empty state when the cart has no items", () => {
  render(<Cart items={[]} onRemove={() => {}} />);

  expect(
    screen.getByRole("heading", { name: /your cart/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/no items yet/i)).toBeInTheDocument();
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});

test("renders one row per cart item", () => {
  const items = [
    { id: 1, name: "Water Truck Service" },
    { id: 2, name: "Borehole Installation" },
  ];

  render(<Cart items={items} onRemove={() => {}} />);

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("Water Truck Service")).toBeInTheDocument();
  expect(screen.getByText("Borehole Installation")).toBeInTheDocument();
  expect(screen.queryByText(/no items yet/i)).not.toBeInTheDocument();
});

test("calls onRemove with the id of the clicked item", async () => {
  const user = userEvent.setup();
  const onRemove = vi.fn();
  const items = [
    { id: 1, name: "Water Truck Service" },
    { id: 2, name: "Borehole Installation" },
  ];

  render(<Cart items={items} onRemove={onRemove} />);

  const removeButtons = screen.getAllByRole("button", { name: /remove/i });
  expect(removeButtons).toHaveLength(2);

  await user.click(removeButtons[1]);

  expect(onRemove).toHaveBeenCalledTimes(1);
  expect(onRemove).toHaveBeenCalledWith(2);
});
