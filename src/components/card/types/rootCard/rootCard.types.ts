import {PortfolioCardData} from "../../card.types";
import {SideH} from "../flowCard/flowCard.types";
import {PortfolioLinkButton} from "../../../linkButton/linkButton";

export type PortfolioLinkData = {
    name?: string,
    side?: SideH,
    element?: PortfolioLinkButton
};

export type PortfolioRootCardData = PortfolioCardData & {
    profilePicture?: string,
    links: PortfolioLinkData[]
};