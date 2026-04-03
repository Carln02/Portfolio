import {Card} from "../../card";
import {define, expose} from "turbodombuilder";
import "./rootCard.css";
import {RootCardView} from "./rootCard.view";
import {RootCardData} from "./rootCard.types";
import {RootCardModel} from "./rootCard.model";
import {LinkData} from "../../../linkButton/linkButton.types";
import {LinkButton} from "../../../linkButton/linkButton";

@define("portfolio-root-card")
export class RootCard extends Card<RootCardView, RootCardData, RootCardModel> {
    @expose("model") links: LinkData[];
    @expose("view") linkButtons: LinkButton[];

    public static defaultProperties = {
        model: RootCardModel,
        view: RootCardView,
    };
}