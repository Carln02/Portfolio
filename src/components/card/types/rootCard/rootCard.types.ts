import {PortfolioCardData} from "../../card.types";
import {PortfolioLinkData} from "../../../linkButton/linkButton.types";

export type PortfolioRootCardData = PortfolioCardData & {
    profilePicture?: string,
    links: PortfolioLinkData[]
};