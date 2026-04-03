import {CardData} from "../../card.types";
import {LinkData} from "../../../linkButton/linkButton.types";

export type RootCardData = CardData & {
    profilePicture?: string,
    links: LinkData[]
};