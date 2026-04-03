import {PortfolioCardData} from "../../card.types";

export enum SideH {
    left = "left",
    right = "right",
}

export type PortfolioFlowCardData = PortfolioCardData & {
    side: SideH;
};