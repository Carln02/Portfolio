import {PortfolioCard} from "../../card";
import {auto, button, Coordinate, define, div, spacer, TurboProperties} from "turbodombuilder";
import {PortfolioFlowCardData, SideH} from "./flowCard.types";
import "./flowCard.css";
import {PortfolioLinkButton} from "../../../linkButton/linkButton";
import {NavigationManager} from "../../../../managers/navigationManager/navigationManager";

@define()
export class PortfolioFlowCard extends PortfolioCard {
    private leftLink: PortfolioLinkButton;
    private rightLink: PortfolioLinkButton;

    public constructor(navigationManager: NavigationManager, data: PortfolioFlowCardData, properties?: TurboProperties) {
        super(navigationManager, data, properties);
        this.addClass("portfolio-flow-card");
        this.side = data.side;
    }

    public get previousLink(): PortfolioLinkButton {
        return this.side == SideH.left ? this.rightLink : this.leftLink;
    }

    public get nextLink(): PortfolioLinkButton {
        return this.side == SideH.right ? this.rightLink : this.leftLink;
    }

    @auto()
    public set side(value: SideH) {
        this.leftLink.text = value == SideH.left ? "Next" : "Previous";
        this.rightLink.text = value == SideH.right ? "Next" : "Previous";
    }

    @auto()
    public set origin(value: Coordinate) {
        super.origin = value;
        this.leftLink.refreshConnection();
        this.rightLink.refreshConnection();
    }

    protected setupUIElements() {
        super.setupUIElements();

        this.leftLink = new PortfolioLinkButton(this, this.navigationManager, {leftIcon: "chevron-left"});
        this.rightLink = new PortfolioLinkButton(this, this.navigationManager, {rightIcon: "chevron-right"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        div({parent: this, classes: "card-buttons", children: [this.leftLink, spacer(), this.rightLink]});
    }
}