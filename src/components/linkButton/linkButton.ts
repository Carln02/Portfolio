import {
    auto,
    DefaultEventName,
    define, element, Point, Shown, StatefulReifect,
    TurboButton,
    TurboRichElementProperties,
    ValidTag
} from "turbodombuilder";
import "./linkButton.css";
import {PortfolioCard} from "../card/card";
import {NavigationManager} from "../../managers/navigationManager/navigationManager";
import {PortfolioLinkData} from "./linkButton.types";
import {SideH} from "../card/types/flowCard/flowCard.types";

@define()
export class PortfolioLinkButton<ElementTag extends ValidTag = "p"> extends TurboButton<ElementTag> {
    private readonly navigationManager: NavigationManager;

    private readonly pathSvg: SVGSVGElement;

    public readonly parentCard: PortfolioCard;

    private attachedCard: PortfolioCard;
    private showConnection: boolean;

    private readonly viewBoxPadding = 50 as const;
    private lastViewBoxUpdate: number = 0;
    private viewBoxUpdateRate: number = 0;
    private lastViewBoxValues: Point = new Point();

    private static showTransition = new StatefulReifect({
        states: Object.values(Shown), styles: {
            [Shown.visible]: {display: ""},
            [Shown.hidden]: {display: "none"}
        }
    });

    public constructor(properties: PortfolioLinkData, parentCard: PortfolioCard, navigationManager: NavigationManager) {
        super({element: properties.name, leftIcon: "chevron-left", rightIcon: "chevron-right"});
        this.showTransition = PortfolioLinkButton.showTransition;

        this.rightIcon.show(properties.side == SideH.right);
        this.leftIcon.show(properties.side == SideH.left);

        this.rank = properties.rank;

        this.parentCard = parentCard;
        this.navigationManager = navigationManager;
        this.pathSvg = element({
            tag: "svg",
            namespace: "http://www.w3.org/2000/svg",
            classes: "link-path",
            parent: this.navigationManager.canvas.content
        })
            .setAttribute("namespace", "http://www.w3.org/2000/svg");

        this.show(false);

        this.addListener(DefaultEventName.click, () => {
            if (!this.attachedCard) return;
            this.navigationManager.navigateTo(this.attachedCard);
        });
    }

    @auto()
    public set rank(value: number) {
        this.toggleClass("primary-button", value == 1);
        this.toggleClass("secondary-button", value == 2);
        this.toggleClass("tertiary-button", value == 3 || !value);
    }

    public attachTo(card: PortfolioCard, showConnection: boolean = true) {
        this.attachedCard?.onMove.remove(this.refreshConnection);
        this.attachedCard = card;
        this.attachedCard.onMove.add(this.refreshConnection);

        this.showConnection = showConnection;
        this.show(true);

        requestAnimationFrame(() => this.refreshConnection());
    }

    public refreshConnection = () => {
        this.pathSvg.removeAllChildren();
        if (!this.showConnection) return;

        requestAnimationFrame(() => {
            const cardRect = this.attachedCard.getBoundingClientRect();
            const buttonRect = this.getBoundingClientRect();

            const cardPosition = this.navigationManager.getPositionOf(this.attachedCard, {
                x: cardRect.x > buttonRect.x + buttonRect.width ? 0
                    : cardRect.x + cardRect.width < buttonRect.x ? 1
                        : 0.5,
                y: cardRect.x > buttonRect.x + buttonRect.width || cardRect.x + cardRect.width < buttonRect.x ? 0.1
                    : cardRect.y > buttonRect.y ? 0.1
                        : 1
            });

            const buttonPosition = this.navigationManager.getPositionOf(this, {
                x: cardRect.x > buttonRect.x + buttonRect.width ? 1
                    : cardRect.x + cardRect.width < buttonRect.x ? 0
                        : 0.5,
                y: cardRect.x > buttonRect.x + buttonRect.width || cardRect.x + cardRect.width < buttonRect.x ? 0.5
                    : cardRect.y > buttonRect.y ? 1
                        : 0
            });

            this.createSCurve(buttonPosition, cardPosition);
            this.updateViewBox(buttonPosition, cardPosition);
        });
    }

    private updateViewBox(start: Point, end: Point) {
        // Ensure updates occur at defined rate
        if (Date.now() - this.lastViewBoxUpdate <= this.viewBoxUpdateRate) return;
        this.lastViewBoxUpdate = Date.now();

        // Knowing that (0, 0) is at the center of the canvas, some points have negative coordinates,
        // so I get the max x and y absolute values in all the points to ensure I'm not ignoring negative values
        [start, end].forEach(p => this.lastViewBoxValues = Point.max(this.lastViewBoxValues, p.abs()));

        // Compute the dimensions by doubling the coordinates and adding the padding
        const width = this.lastViewBoxValues.x * 2 + this.viewBoxPadding * 2;
        const height = this.lastViewBoxValues.y * 2 + this.viewBoxPadding * 2;

        this.pathSvg.setAttribute("width", width)
            .setAttribute("height", height)
            .setAttribute("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`);
    }

    private createSCurve(start: Point, end: Point) {
        const control1 = {x: start.x + (end.x - start.x) / 2, y: start.y};
        const control2 = {x: end.x - (end.x - start.x) / 2, y: end.y};

        const pathData = `M${start.x},${start.y} C${control1.x},${control1.y} ${control2.x},${control2.y} ${end.x},${end.y}`;

        element({tag: "path", namespace: "http://www.w3.org/2000/svg", parent: this.pathSvg})
            .setAttribute("namespace", "http://www.w3.org/2000/svg")
            .setAttribute("d", pathData)
            .setAttribute("stroke", "black")
            .setAttribute("fill", "transparent")
            .setAttribute("stroke-width", "2");
    }
}