import { atom, PrimitiveAtom } from "jotai";
import { focusAtom } from "jotai/optics";
import { OpticFor } from "optics-ts";

import {
  SearchType,
  Filter,
  Baseball,
  Basketball,
  Football,
  Hockey,
  Soccer,
  Tennis,
  AutoRacing,
  ItemCount,
} from "../types/jotai";

const baseAtomItem = {
  show: false,
  team: "",
  position: "",
  league: "",
  items: [],
};

export const queryAtom = atom<string>("");

export const searchTypeAtom = atom<SearchType>("player");

export const filterAtom = atom<Filter>("all");

export const baseballAtom: PrimitiveAtom<Baseball> = atom({
  ...baseAtomItem,
} as Baseball);

export const basketballAtom: PrimitiveAtom<Basketball> = atom({
  ...baseAtomItem,
} as Basketball);

export const footballAtom: PrimitiveAtom<Football> = atom({
  ...baseAtomItem,
} as Football);

export const hockeyAtom: PrimitiveAtom<Hockey> = atom({
  ...baseAtomItem,
} as Hockey);

export const soccerAtom: PrimitiveAtom<Soccer> = atom({
  ...baseAtomItem,
} as Soccer);

export const tennisAtom: PrimitiveAtom<Tennis> = atom({
  ...baseAtomItem,
} as Tennis);

export const autoRacingAtom: PrimitiveAtom<AutoRacing> = atom({
  ...baseAtomItem,
} as AutoRacing);

export const baseballShowAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("show")
);

export const baseballItemsAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("items")
);

export const baseballTeamAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("team")
);

export const baseballPositionAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("position")
);

export const baseballLeagueAtom = focusAtom(
  baseballAtom,
  (optic: OpticFor<Baseball>) => optic.prop("league")
);

export const basketballShowAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("show")
);

export const basketballItemsAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("items")
);

export const basketballTeamAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("team")
);

export const basketballPositionAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("position")
);

export const basketballLeagueAtom = focusAtom(
  basketballAtom,
  (optic: OpticFor<Basketball>) => optic.prop("league")
);

export const footballShowAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("show")
);
export const footballItemsAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("items")
);

export const footballTeamAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("team")
);

export const footballPositionAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("position")
);

export const footballLeagueAtom = focusAtom(
  footballAtom,
  (optic: OpticFor<Football>) => optic.prop("league")
);

export const hockeyShowAtom = focusAtom(hockeyAtom, (optic: OpticFor<Hockey>) =>
  optic.prop("show")
);

export const hockeyItemsAtom = focusAtom(
  hockeyAtom,
  (optic: OpticFor<Hockey>) => optic.prop("items")
);

export const hockeyTeamAtom = focusAtom(hockeyAtom, (optic: OpticFor<Hockey>) =>
  optic.prop("team")
);

export const hockeyPositionAtom = focusAtom(
  hockeyAtom,
  (optic: OpticFor<Hockey>) => optic.prop("position")
);

export const hockeyLeagueAtom = focusAtom(
  hockeyAtom,
  (optic: OpticFor<Hockey>) => optic.prop("league")
);

export const soccerShowAtom = focusAtom(soccerAtom, (optic: OpticFor<Soccer>) =>
  optic.prop("show")
);

export const soccerItemsAtom = focusAtom(
  soccerAtom,
  (optic: OpticFor<Soccer>) => optic.prop("items")
);

export const soccerTeamAtom = focusAtom(soccerAtom, (optic: OpticFor<Soccer>) =>
  optic.prop("team")
);

export const soccerPositionAtom = focusAtom(
  soccerAtom,
  (optic: OpticFor<Soccer>) => optic.prop("position")
);

export const soccerLeagueAtom = focusAtom(
  soccerAtom,
  (optic: OpticFor<Soccer>) => optic.prop("league")
);

export const tennisShowAtom = focusAtom(tennisAtom, (optic: OpticFor<Tennis>) =>
  optic.prop("show")
);

export const tennisItemsAtom = focusAtom(
  tennisAtom,
  (optic: OpticFor<Tennis>) => optic.prop("items")
);

export const tennisTeamAtom = focusAtom(tennisAtom, (optic: OpticFor<Tennis>) =>
  optic.prop("team")
);

export const tennisPositionAtom = focusAtom(
  tennisAtom,
  (optic: OpticFor<Tennis>) => optic.prop("position")
);

export const tennisLeagueAtom = focusAtom(
  tennisAtom,
  (optic: OpticFor<Tennis>) => optic.prop("league")
);

export const autoRacingShowAtom = focusAtom(
  autoRacingAtom,
  (optic: OpticFor<AutoRacing>) => optic.prop("show")
);

export const autoRacingItemsAtom = focusAtom(
  autoRacingAtom,
  (optic: OpticFor<AutoRacing>) => optic.prop("items")
);

export const autoRacingTeamAtom = focusAtom(
  autoRacingAtom,
  (optic: OpticFor<AutoRacing>) => optic.prop("team")
);

export const autoRacingPositionAtom = focusAtom(
  autoRacingAtom,
  (optic: OpticFor<AutoRacing>) => optic.prop("position")
);

export const autoRacingLeagueAtom = focusAtom(
  autoRacingAtom,
  (optic: OpticFor<AutoRacing>) => optic.prop("league")
);

export const itemCountAtom = atom((get) => {
  return {
    baseball: get(baseballAtom).items.length,
    basketball: get(basketballAtom).items.length,
    football: get(footballAtom).items.length,
    hockey: get(hockeyAtom).items.length,
    soccer: get(soccerAtom).items.length,
    tennis: get(tennisAtom).items.length,
    autoRacing: get(autoRacingAtom).items.length,
  } as ItemCount;
});
