import {PortfolioCard} from "../../card";
import {auto, Coordinate, define, div, spacer, TurboProperties} from "turbodombuilder";
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

        this.leftLink.rank = value == SideH.left ? 2 : 3;
        this.rightLink.rank = value == SideH.right ? 2 : 3;
    }

    @auto()
    public set origin(value: Coordinate) {
        super.origin = value;
        this.leftLink.refreshConnection();
        this.rightLink.refreshConnection();
    }

    protected setupUIElements() {
        super.setupUIElements();

        this.leftLink = new PortfolioLinkButton({side: SideH.left}, this, this.navigationManager);
        this.rightLink = new PortfolioLinkButton({side: SideH.right}, this, this.navigationManager);
    }

    protected setupUILayout() {
        super.setupUILayout();
        div({parent: this, classes: "card-buttons", children: [this.leftLink, this.rightLink]});
    }
}