import { atom, PrimitiveAtom } from "jotai";
import { focusAtom } from "jotai/optics";
import { OpticFor } from "optics-ts";

import {
  Filter,
  Baseball,
  Basketball,
  Football,
  Hockey,
  Soccer,
  ItemCount,
} from "../types/jotai";

export const queryAtom = atom<string>("");

export const filterAtom = atom<Filter>("all");

export const baseballAtom: PrimitiveAtom<Baseball> = atom({
  show: false,
  items: [],
} as Baseball);

export const basketballAtom: PrimitiveAtom<Basketball> = atom({
  show: false,
  items: [],
} as Basketball);

export const footballAtom: PrimitiveAtom<Football> = atom({
  show: false,
  items: [],
} as Football);

export const hockeyAtom: PrimitiveAtom<Hockey> = atom({
  show: false,
  items: [],
} as Hockey);

export const soccerAtom: PrimitiveAtom<Soccer> = atom({
  show: false,
  items: [],
} as Soccer);

export const setBaseballShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(baseballAtom, (prev) => ({ ...prev, show: item }));
  }
);

export const baseballShowAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("show")
);

export const setBaseballItemsAtom = atom(
  () => "",
  (_get, set, item: Baseball["items"]) => {
    set(baseballAtom, (prev) => ({ ...prev, items: item }));
  }
);

export const baseballItemsAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("items")
);

export const setBasketballShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(basketballAtom, (prev) => ({ ...prev, show: item }));
  }
);

export const basketballShowAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("show")
);

export const setBasketballItemsAtom = atom(
  () => "",
  (_get, set, item: Basketball["items"]) => {
    set(basketballAtom, (prev) => ({ ...prev, items: item }));
  }
);

export const basketballItemsAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("items")
);

export const setFootballShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(footballAtom, (prev) => ({ ...prev, show: item }));
  }
);

export const footballShowAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("show")
);

export const setFootballItemsAtom = atom(
  () => "",
  (_get, set, item: Football["items"]) => {
    set(footballAtom, (prev) => ({ ...prev, items: item }));
  }
);

export const footballItemsAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("items")
);

export const setHockeyShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(hockeyAtom, (prev) => ({ ...prev, show: item }));
  }
);

export const hockeyShowAtom = focusAtom(hockeyAtom, (optic: OpticFor<Hockey>) =>
  optic.prop("show")
);

export const setHockeyItemsAtom = atom(
  () => "",
  (_get, set, item: Hockey["items"]) => {
    set(hockeyAtom, (prev) => ({ ...prev, items: item }));
  }
);

export const hockeyItemsAtom = focusAtom(
  hockeyAtom,
  (optic: OpticFor<Hockey>) => optic.prop("items")
);

export const setSoccerShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(soccerAtom, (prev) => ({ ...prev, show: item }));
  }
);

export const soccerShowAtom = focusAtom(soccerAtom, (optic: OpticFor<Soccer>) =>
  optic.prop("show")
);

export const setSoccerItemsAtom = atom(
  () => "",
  (_get, set, item: Soccer["items"]) => {
    set(soccerAtom, (prev) => ({ ...prev, items: item }));
  }
);

export const soccerItemsAtom = focusAtom(
  soccerAtom,
  (optic: OpticFor<Soccer>) => optic.prop("items")
);

export const itemCountAtom = atom((get) => {
  return {
    baseball: get(baseballAtom).items.length,
    basketball: get(basketballAtom).items.length,
    football: get(footballAtom).items.length,
    hockey: get(hockeyAtom).items.length,
    soccer: get(soccerAtom).items.length,
  } as ItemCount;
});
