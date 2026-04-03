import {
    define,
    TurboElement,
    DefaultEventName,
    div,
    turbo, TurboIcon
} from "turbodombuilder";
import "./toolbar.css";
import {RootCard} from "../card/types/rootCard/rootCard";
import {Canvas} from "../canvas/canvas";

@define("portfolio-toolbar")
export class Toolbar extends TurboElement {
    public canvas: Canvas;

    public generateHomeButton(rootCard: RootCard) {
        const homeButton = TurboIcon.create({icon: "home", classes: "portfolio-tool"});
        turbo(homeButton).on(DefaultEventName.click, () => {
            this.canvas?.enableTransition(true);
            this.canvas?.navigateTo(rootCard);
        })
        turbo(this).addChild([homeButton, div({classes: "toolbar-separator"})], 0);
    }

    public addTools(...entries: HTMLElement[]) {
        entries.forEach(entry => {
            turbo(entry).addClass("portfolio-tool").addToParent(this);
        });
    }
}