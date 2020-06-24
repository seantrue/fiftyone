import { atom, atomFamily } from "recoil";

export const indicatorPosition = atom({
  key: "indicatorPosition",
  default: 0,
});

export const mousePosition = atom({
  key: "mainMousePosition",
  default: [0, 0],
});

export const mainSize = atom({
  key: "mainSize",
  default: [0, 0],
});

export const mainTop = atom({
  key: "mainTop",
  default: 0,
});

export const viewCount = atom({
  key: "viewCount",
  default: 0,
});

export const currentListTop = atom({
  key: "currentListTop",
  default: 0,
});

export const currentListHeight = atom({
  key: "currentListHeight",
  default: 0,
});

export const isDraggingIndicator = atom({
  key: "isDraggingIndicator",
  default: false,
});

export const itemsPerRequest = atom({
  key: "itemsPerRequest",
  default: 50,
});

export const fields = atomFamily({
  key: "field",
  default: {
    active: true,
    color: "#CCCCCC",
  },
});

export const segmentIsLoaded = atomFamily({
  key: "segmentIsLoaded",
  default: false,
});

export const itemPosition = atomFamily({
  key: "itemPosition",
  default: null,
});

export const gridMargin = atome({
  key: "gridMargin",
  default: 4,
});
