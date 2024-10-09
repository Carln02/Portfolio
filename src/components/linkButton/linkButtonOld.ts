import {
    Coordinate, DefaultEventName,
    define, element, Shown, StatefulReifect,
    TurboButton,
    TurboRichElementProperties,
    ValidTag
} from "turbodombuilder";
import "./linkButton.css";
import {PortfolioCard} from "../card/card";
import {NavigationManager} from "../../managers/navigationManager/navigationManager";

@define()
export class PortfolioLinkButton<ElementTag extends ValidTag = "p"> extends TurboButton<ElementTag> {
    private readonly navigationManager: NavigationManager;

    private readonly pathSvg: SVGSVGElement;

    public readonly parentCard: PortfolioCard;

    private attachedCard: PortfolioCard;
    private showConnection: boolean;

    private readonly viewBoxPadding = 50 as const;

    private static showTransition = new StatefulReifect({
        states: Object.values(Shown), styles: {
            [Shown.visible]: {display: ""},
            [Shown.hidden]: {display: "none"}
        }
    });

    public constructor(parentCard: PortfolioCard, navigationManager: NavigationManager,
                       properties: TurboRichElementProperties<ElementTag>) {
        super(properties);
        this.showTransition = PortfolioLinkButton.showTransition;

        this.parentCard = parentCard;
        this.navigationManager = navigationManager;
        this.pathSvg = element({
            tag: "svg",
            namespace: "http://www.w3.org/2000/svg",
            classes: "link-path",
            parent: this
        })
            .setAttribute("namespace", "http://www.w3.org/2000/svg");

        this.show(false);

        this.addListener(DefaultEventName.click, () => {
            if (!this.attachedCard) return;
            this.navigationManager.navigateTo(this.attachedCard);
        });
    }

    public attachTo(card: PortfolioCard, showConnection: boolean = true) {
        this.attachedCard?.onMove.remove(this.refresh);
        this.attachedCard = card;
        this.attachedCard.onMove.add(this.refresh);
        this.showConnection = showConnection;
        this.show(true);
        this.refreshConnection();
    }

    private refresh = () => this.refreshConnection();

    public refreshConnection() {
        if (!this.showConnection) return;
        requestAnimationFrame(() => {
            const cardRect = this.attachedCard.getBoundingClientRect();
            const buttonRect = this.getBoundingClientRect();

            const startPoint = {x: 0, y: 0};
            const endPoint = {
                x: cardRect.x - (buttonRect.x + buttonRect.width),
                y: cardRect.y - (buttonRect.y + buttonRect.height / 2) + 20
            };

            endPoint.x /= this.navigationManager.scale;
            endPoint.y /= this.navigationManager.scale;

            this.createSCurve(startPoint, endPoint);
            this.updateViewBox(startPoint, endPoint);
        });
    }

    private updateViewBox(start: Coordinate, end: Coordinate) {
        const signedWidth = end.x - start.x;
        const signedHeight = end.y - start.y;

        const width = Math.abs(signedWidth) + this.viewBoxPadding * 2;
        const height = Math.abs(signedHeight) + this.viewBoxPadding * 2;

        this.pathSvg.setStyle("top", signedHeight > 0 ? `calc(50% - ${start.y + this.viewBoxPadding}px)`
            : `calc(50% - ${start.y + height - this.viewBoxPadding}px)`)
            .setStyle("left", `calc(100% - ${start.x + this.viewBoxPadding}px)`)
            .setAttribute("width", width)
            .setAttribute("height", height)
            .setAttribute("viewBox", `-${this.viewBoxPadding} -${signedHeight > 0 ? this.viewBoxPadding : this.viewBoxPadding + height - 2 * this.viewBoxPadding} ${width} ${height}`);
    }

    private createSCurve(start: Coordinate, end: Coordinate) {
        const control1 = {x: start.x + (end.x - start.x) / 2, y: start.y};
        const control2 = {x: end.x - (end.x - start.x) / 2, y: end.y};

        const pathData = `M${start.x},${start.y} C${control1.x},${control1.y} ${control2.x},${control2.y} ${end.x},${end.y}`;

        this.pathSvg.removeAllChildren();
        element({tag: "path", namespace: "http://www.w3.org/2000/svg", parent: this.pathSvg})
            .setAttribute("namespace", "http://www.w3.org/2000/svg")
            .setAttribute("d", pathData)
            .setAttribute("stroke", "black")
            .setAttribute("fill", "transparent")
            .setAttribute("stroke-width", "2");
    }
}