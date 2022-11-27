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

export const filterAtom = atom<Filter>({
  baseball: true,
  basketball: true,
  football: true,
  hockey: true,
  soccer: true,
});

export const baseballAtom: PrimitiveAtom<Baseball> = atom({
  show: false,
  debouncedShow: false,
  items: [],
} as Baseball);

export const basketballAtom: PrimitiveAtom<Basketball> = atom({
  show: false,
  debouncedShow: false,
  items: [],
} as Basketball);

export const footballAtom: PrimitiveAtom<Football> = atom({
  show: false,
  debouncedShow: false,
  items: [],
} as Football);

export const hockeyAtom: PrimitiveAtom<Hockey> = atom({
  show: false,
  debouncedShow: false,
  items: [],
} as Hockey);

export const soccerAtom: PrimitiveAtom<Soccer> = atom({
  show: false,
  debouncedShow: false,
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

export const setBaseballDebouncedShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(baseballAtom, (prev) => ({ ...prev, debouncedShow: item }));
  }
);

export const baseballDebouncedAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("debouncedShow")
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

export const setBasketballDebouncedShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(basketballAtom, (prev) => ({ ...prev, debouncedShow: item }));
  }
);

export const basketballDebouncedAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("debouncedShow")
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

export const setFootballDebouncedShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(footballAtom, (prev) => ({ ...prev, debouncedShow: item }));
  }
);

export const footballDebouncedAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("debouncedShow")
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

export const setHockeyDebouncedShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(hockeyAtom, (prev) => ({ ...prev, debouncedShow: item }));
  }
);

export const hockeyDebouncedAtom = focusAtom(
  hockeyAtom,
  (optic: OpticFor<Hockey>) => optic.prop("debouncedShow")
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

export const setSoccerDebouncedShowAtom = atom(
  () => "",
  (_get, set, item: boolean) => {
    set(soccerAtom, (prev) => ({ ...prev, debouncedShow: item }));
  }
);

export const soccerDebouncedAtom = focusAtom(
  soccerAtom,
  (optic: OpticFor<Soccer>) => optic.prop("debouncedShow")
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

export const showAtom = atom(
  (get) => {
    return {
      baseball: get(baseballShowAtom),
      basketball: get(basketballShowAtom),
      football: get(footballShowAtom),
      hockey: get(hockeyShowAtom),
      soccer: get(soccerShowAtom),
    };
  },
  (_get, set, update: Partial<Filter>) => {
    if (update.baseball) {
      set(baseballShowAtom, update.baseball);
    }
    if (update.basketball) {
      set(basketballShowAtom, update.basketball);
    }
    if (update.football) {
      set(footballShowAtom, update.football);
    }
    if (update.hockey) {
      set(hockeyShowAtom, update.hockey);
    }
    if (update.soccer) {
      set(soccerShowAtom, update.soccer);
    }
  }
);

export const debouncedShowAtom = atom(
  (get) => {
    return {
      baseball: get(baseballAtom).debouncedShow,
      basketball: get(basketballAtom).debouncedShow,
      football: get(footballAtom).debouncedShow,
      hockey: get(hockeyAtom).debouncedShow,
      soccer: get(soccerAtom).debouncedShow,
    };
  },
  (_get, set, update: Partial<Filter>) => {
    if (update.baseball) {
      set(baseballDebouncedAtom, update.baseball);
    }
    if (update.basketball) {
      set(basketballDebouncedAtom, update.basketball);
    }
    if (update.football) {
      set(footballDebouncedAtom, update.football);
    }
    if (update.hockey) {
      set(hockeyDebouncedAtom, update.hockey);
    }
    if (update.soccer) {
      set(soccerDebouncedAtom, update.soccer);
    }
  }
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
