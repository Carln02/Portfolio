import {modelSignal, SideH, signal, TurboModel} from "turbodombuilder";
import {ButtonLinkColor} from "./linkButton.types";
import {Card} from "../card/card";

export class LinkButtonModel extends TurboModel {
    @modelSignal() name: string;
    @modelSignal() side: SideH;
    @modelSignal() rank: number;
    @modelSignal() color: ButtonLinkColor;
    @modelSignal() target: Card;

    @signal showConnection: boolean = true;
}