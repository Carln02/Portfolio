import {PortfolioCard} from "../../card";
import {PortfolioLinkButton} from "../../../linkButton/linkButton";
import {NavigationManager} from "../../../../managers/navigationManager/navigationManager";
import {auto, Coordinate, define, div, h2, img, spacer, TurboMap, TurboProperties} from "turbodombuilder";
import {PortfolioLinkData, PortfolioRootCardData} from "./rootCard.types";
import {SideH} from "../flowCard/flowCard.types";
import "./rootCard.css";

@define()
export class PortfolioRootCard extends PortfolioCard {
    protected readonly data: PortfolioRootCardData;

    public readonly links: TurboMap<string, PortfolioLinkData>;

    private profilePicture: HTMLImageElement;

    public constructor(navigationManager: NavigationManager, data: PortfolioRootCardData, properties?: TurboProperties) {
        super(navigationManager, data, properties);
        this.addClass("portfolio-root-card");

        this.links = new TurboMap<string, PortfolioLinkData>();
        this.links.enforceImmutability = false;

        this.setupLinks();
    }

    @auto()
    public set origin(value: Coordinate) {
        super.origin = value;
        this.links?.forEach(link => link.element?.refreshConnection());
    }

    protected setupUIElements() {
        super.setupUIElements();
        if (this.data.profilePicture) this.profilePicture = img({
            src: this.data.profilePicture,
            alt: "profile picture"
        });
    }

    protected setupUILayout() {
        div({
            parent: this, classes: "card-title-div", children: [
                h2({text: "Hey!"}),
                spacer(),
                this.profilePicture
            ]
        });
        super.setupUILayout();
    }

    private setupLinks() {
        this.data.links.forEach(link => {
            const linkButton = new PortfolioLinkButton(this, this.navigationManager, {text: link.name});
            if (link.side == SideH.left) linkButton.leftIcon = "chevron-left";
            else linkButton.rightIcon = "chevron-right";
            this.links.set(link.name, {...link, element: linkButton});
        });

        div({
            parent: this, classes: "card-buttons", children: this.links.valuesArray()
                .map(link => link.element)
                .filter(link => link !== undefined)
        });
    }
}