import {define, effect, expose, turbo, TurboButton} from "turbodombuilder";
import "./linkButton.css";
import {Card} from "../card/card";
import {ButtonLinkColor, LinkData} from "./linkButton.types";
import {LinkButtonView} from "./linkButton.view";
import {LinkButtonModel} from "./linkButton.model";
import {Canvas} from "../canvas/canvas";

@define("portfolio-link-button")
export class LinkButton extends TurboButton<any, LinkButtonView, LinkData, LinkButtonModel> {
    public static defaultProperties = {
        model: LinkButtonModel,
        view: LinkButtonView,
        leftIcon: "chevron-left",
        rightIcon: "chevron-right",
    }

    @expose("model") name: string;
    @expose("model") color: ButtonLinkColor;
    @expose("model") target: Card;
    @expose("model") rank: number;

    public get canvas(): Canvas {
        return this.card?.canvas;
    }

    public get card(): Card {
        return turbo(this).closest(Card);
    }

    public attachTo(card: Card, showConnection: boolean = true) {
        if (!card) return;
        this.model.target = card;
        this.model.showConnection = showConnection;
        turbo(this).show(true);
    }

    public refreshConnection() {
        this.view.refreshConnection();
    }
}