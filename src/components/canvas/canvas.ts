import {css, define, div, Point, TurboElement} from "turbodombuilder";
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

    //Main toolbar
    private readonly toolbar: PortfolioToolbar;

    public constructor(navigationManager: NavigationManager, toolManager: ToolManager) {
        super({parent: document.body});
        this.navigationManager = navigationManager;

        this.content = div({parent: this, id: "canvas-content"});

        //Init toolbar
        this.toolbar = new PortfolioToolbar(toolManager, {parent: this, classes: "bottom-toolbar"});
        this.toolbar.populateWithAllTools();
    }

    public get scale() {
        return this.navigationManager.scale;
    }

    /**
     * @description Translate and scale the canvas by the given values
     * @param translation
     * @param scale
     */
    public transform(translation: Point, scale: number) {
        this.content.setStyle("transform", css`translate3d(${translation.x}px, ${translation.y}px, 0) scale3d(${scale}, ${scale}, 1)`);
    }
}
