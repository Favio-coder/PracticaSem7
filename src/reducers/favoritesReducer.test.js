import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FAVORITE_ACTIONS, favoritesReducer } from "./favoritesReducer.js";

function deepFreeze(value) {
  Object.freeze(value);
  Object.values(value).forEach((child) => {
    if (child && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child);
    }
  });
  return value;
}

describe("favoritesReducer", () => {
  it("adds a favorite without changing the previous state", () => {
    const product = deepFreeze({ id: 1, title: "Producto" });
    const previous = deepFreeze([]);
    const next = favoritesReducer(previous, {
      type: FAVORITE_ACTIONS.ADD,
      product,
    });

    assert.deepEqual(previous, []);
    assert.deepEqual(next, [product]);
    assert.notStrictEqual(next, previous);
  });

  it("does not add duplicate favorites", () => {
    const product = deepFreeze({ id: 1, title: "Producto" });
    const previous = deepFreeze([product]);

    assert.strictEqual(
      favoritesReducer(previous, { type: FAVORITE_ACTIONS.ADD, product }),
      previous,
    );
  });

  it("removes an existing favorite without changing the previous state", () => {
    const first = deepFreeze({ id: 1, title: "Primero" });
    const second = deepFreeze({ id: 2, title: "Segundo" });
    const previous = deepFreeze([first, second]);
    const next = favoritesReducer(previous, {
      type: FAVORITE_ACTIONS.REMOVE,
      id: first.id,
    });

    assert.deepEqual(previous, [first, second]);
    assert.deepEqual(next, [second]);
    assert.notStrictEqual(next, previous);
  });

  it("clears favorites without changing the previous state", () => {
    const previous = deepFreeze([{ id: 1, title: "Producto" }]);
    const next = favoritesReducer(previous, { type: FAVORITE_ACTIONS.CLEAR });

    assert.deepEqual(previous, [{ id: 1, title: "Producto" }]);
    assert.deepEqual(next, []);
    assert.notStrictEqual(next, previous);
  });
});
