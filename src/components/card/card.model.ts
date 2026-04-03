import {Coordinate, modelSignal, TurboModel} from "turbodombuilder";
import {CardData} from "./card.types";

export class CardModel<DataType extends CardData = CardData> extends TurboModel<DataType> {
    @modelSignal() origin: Coordinate;
    @modelSignal() images: string[];
    @modelSignal() title: string;
    @modelSignal() location: string;
    @modelSignal() awardedBy: string;
    @modelSignal() startDate: Date;
    @modelSignal() endDate: Date;
    @modelSignal() link: string;
    @modelSignal() linkText: string;
    @modelSignal() tags: string[];
    @modelSignal() description: string;
    @modelSignal() type: string;
}