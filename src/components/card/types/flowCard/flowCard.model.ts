import {CardModel} from "../../card.model";
import {modelSignal, SideH, signal} from "turbodombuilder";

export class FlowCardModel extends CardModel {
    @modelSignal() side: SideH;
}