import {Card} from "../../card";
import {define, expose, SideH} from "turbodombuilder";
import {FlowCardData} from "./flowCard.types";
import "./flowCard.css";
import {FlowCardView} from "./flowCard.view";
import {FlowCardModel} from "./flowCard.model";
import {LinkButton} from "../../../linkButton/linkButton";

@define("portfolio-flow-card")
export class FlowCard extends Card<FlowCardView, FlowCardData, FlowCardModel> {
    @expose("model") public side: SideH;
    @expose("view") public previousLink: LinkButton;
    @expose("view") public nextLink: LinkButton;

    public static defaultProperties = {
        model: FlowCardModel,
        view: FlowCardView,
    }

}