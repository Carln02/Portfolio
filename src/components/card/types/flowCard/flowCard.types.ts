import {CardData} from "../../card.types";
import {SideH} from "turbodombuilder";

export type FlowCardData = CardData & {
    side: SideH;
};