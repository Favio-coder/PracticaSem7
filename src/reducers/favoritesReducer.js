export const FAVORITE_ACTIONS = {
  ADD: "add",
  REMOVE: "remove",
  CLEAR: "clear",
};

export function favoritesReducer(state, action) {
  switch (action.type) {
    case FAVORITE_ACTIONS.ADD:
      return state.some((product) => product.id === action.product.id)
        ? state
        : [...state, action.product];
    case FAVORITE_ACTIONS.REMOVE:
      return state.some((product) => product.id === action.id)
        ? state.filter((product) => product.id !== action.id)
        : state;
    case FAVORITE_ACTIONS.CLEAR:
      return state.length === 0 ? state : [];
    default:
      return state;
  }
}
