import {div, effect, SideH, spacer, turbo} from "turbodombuilder";
import {CardView} from "../../card.view";
import {FlowCardModel} from "./flowCard.model";
import {LinkButton} from "../../../linkButton/linkButton";
import {FlowCard} from "./flowCard";

export class FlowCardView extends CardView<FlowCard, FlowCardModel> {
    private leftLink: LinkButton;
    private rightLink: LinkButton;

    public get previousLink(): LinkButton {
        return this.model.side == SideH.left ? this.rightLink : this.leftLink;
    }

    public get nextLink(): LinkButton {
        return this.model.side == SideH.right ? this.rightLink : this.leftLink;
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.leftLink = (LinkButton as any).create({data: {side: SideH.left}});
        this.rightLink = (LinkButton as any).create({data: {side: SideH.right}});
    }

    protected setupUILayout() {
        super.setupUILayout();
        turbo(this).addChild(div({classes: "card-buttons", children: [this.leftLink, spacer(), this.rightLink]}));
    }

    @effect updateSide() {
        this.leftLink.name = this.model.side == SideH.left ? "Next" : "Previous";
        this.rightLink.name = this.model.side == SideH.right ? "Next" : "Previous";

        this.leftLink.rank = this.model.side == SideH.left ? 2 : 3;
        this.rightLink.rank = this.model.side == SideH.right ? 2 : 3;
    }

    @effect updateOrigin() {
        super.updateOrigin();
        this.nextLink.refreshConnection();
    }
}