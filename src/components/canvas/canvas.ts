import {css, define, div, Point, Reifect, TurboElement} from "turbodombuilder";
import {PortfolioToolbar} from "../toolbar/toolbar";
import {NavigationManager} from "../../managers/navigationManager/navigationManager";
import {ToolManager} from "../../managers/toolManager/toolManager";
import "./canvas.css";

/**
 * @description Class representing a canvas on which the user can add cards, connect them, move them around, etc.
 */
@define()
export class PortfolioCanvas extends TurboElement {

    //Canvas parent --> contains the main components that are translated/scaled
    public readonly content: HTMLDivElement;

    //Canvas's attached navigation manager
    public readonly navigationManager: NavigationManager;

    private readonly transition: Reifect;

    //Main toolbar
    public readonly toolbar: PortfolioToolbar;

    private readonly background: HTMLElement;

    public constructor(navigationManager: NavigationManager, toolManager: ToolManager) {
        super({parent: document.body});
        this.navigationManager = navigationManager;

        this.background = div({parent: this, id: "background"});

        this.content = div({parent: this, id: "canvas-content"});

        this.transition = new Reifect({
            transitionProperties: "transform",
            transitionDuration: 0.3,
            transitionTimingFunction: "ease-out",
        });

        //Init toolbar
        this.toolbar = new PortfolioToolbar(toolManager, {parent: this, classes: "bottom-toolbar"});
        this.toolbar.populateWithAllTools();
    }

    public get translation() {
        return this.navigationManager.translation;
    }

    public get scale() {
        return this.navigationManager.scale;
    }

    public enableTransition(b: boolean) {
        this.transition.enabled.transition = b;
        this.transition.apply(this.content);
    }

    /**
     * @description Translate and scale the canvas by the given values
     * @param translation
     * @param scale
     */
    public transform(translation: Point, scale: number) {
        this.content.setStyle("transform", css`translate3d(${translation.x}px, ${translation.y}px, 0) scale3d(${scale}, ${scale}, 1)`);
        this.updateBackgroundPosition();
    }

    private updateBackgroundPosition(parent: HTMLElement = this.background) {
        const computedPosition = this.translation.object;

        while (computedPosition.x < 0) computedPosition.x += 1920;
        while (computedPosition.x >= 1920) computedPosition.x -= 1920;

        while (computedPosition.y < 0) computedPosition.y += 1080;
        while (computedPosition.y >= 1080) computedPosition.y -= 1080;

        parent.setStyle("backgroundPosition", `${computedPosition.x}px ${computedPosition.y}px`, true);
        parent.setStyle("backgroundImage", this.scale < 0.5 ? "none" : "url(\"assets/misc/dot-bg-pattern.png\")")
        parent.setStyle("backgroundSize", `${1920 * this.scale * 0.8}px`, true);
    }

}
