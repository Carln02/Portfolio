import {SideH} from "turbodombuilder";
import {Card} from "../card/card";

export type LinkData = {
    name?: string,
    side?: SideH,
    rank?: number,
    color?: ButtonLinkColor,
    target?: Card
};

export enum ButtonLinkColor {
    purple = "purple",
    blue = "blue",
    green = "green"
}