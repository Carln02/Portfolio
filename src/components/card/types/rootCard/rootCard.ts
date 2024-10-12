import {PortfolioCard} from "../../card";
import {PortfolioLinkButton} from "../../../linkButton/linkButton";
import {NavigationManager} from "../../../../managers/navigationManager/navigationManager";
import {auto, Coordinate, define, div, h2, img, spacer, TurboMap, TurboProperties} from "turbodombuilder";
import {PortfolioRootCardData} from "./rootCard.types";
import "./rootCard.css";
import {ButtonLinkColor, PortfolioLinkData} from "../../../linkButton/linkButton.types";

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
            if (link.rank == 1) link.color = ButtonLinkColor.purple;
            else if (link.rank == 2) link.color = ButtonLinkColor.blue;
            else if (link.rank == 3) link.color = ButtonLinkColor.green;

            const linkButton = new PortfolioLinkButton(link, this, this.navigationManager);
            this.links.set(link.name, {...link, element: linkButton});
        });

        div({
            parent: this, classes: "card-buttons", children: [
                ...this.links.valuesArray()
                .filter(link => !link.rank || link.rank == 2)
                .map(link => link.element)
                .filter(link => link !== undefined),
                ...this.links.valuesArray()
                    .filter(link => link.rank == 1)
                    .map(link => link.element)
                    .filter(link => link !== undefined)
                ]
        });
    }
}