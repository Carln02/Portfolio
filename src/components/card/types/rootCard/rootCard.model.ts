import {CardModel} from "../../card.model";
import {modelSignal} from "turbodombuilder";
import {LinkData} from "../../../linkButton/linkButton.types";

export class RootCardModel extends CardModel {
    @modelSignal() profilePicture: string;
    @modelSignal() links: LinkData[];
}