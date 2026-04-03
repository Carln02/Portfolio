import {SideH} from "../card/types/flowCard/flowCard.types";
import {PortfolioLinkButton} from "./linkButton";

export type PortfolioLinkData = {
    name?: string,
    side?: SideH,
    rank?: number,
    color?: ButtonLinkColor,
    element?: PortfolioLinkButton
};

export enum ButtonLinkColor {
    purple = "purple",
    blue = "blue",
    green = "green"
}