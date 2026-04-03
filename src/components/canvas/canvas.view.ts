import {css, div, effect, turbo, TurboView} from "turbodombuilder";
import {Canvas} from "./canvas";
import {CanvasModel} from "./canvas.model";

export class CanvasView extends TurboView<Canvas, CanvasModel> {
    private background: HTMLElement;
    public content: HTMLDivElement;

    protected setupUIElements() {
        super.setupUIElements();

        this.background = div({parent: this.element, id: "background"});
        this.content = div({parent: this.element, id: "canvas-content"});
    }

    @effect transformCanvas() {
        turbo(this.content).setStyle("transform",
            css`translate3d(${this.model.translation.x}px, ${this.model.translation.y}px, 0) 
            scale3d(${this.model.scale}, ${this.model.scale}, 1)`);

        const computedPosition = this.model.translation.object;

        while (computedPosition.x < 0) computedPosition.x += 1920;
        while (computedPosition.x >= 1920) computedPosition.x -= 1920;

        while (computedPosition.y < 0) computedPosition.y += 1080;
        while (computedPosition.y >= 1080) computedPosition.y -= 1080;

        turbo(this.background).setStyles({
            "backgroundPosition": `${computedPosition.x}px ${computedPosition.y}px`,
            "backgroundImage": this.model.scale < 0.5 ? "none" : "url(\"assets/misc/dot-bg-pattern.png\")",
            "backgroundSize": `${1920 * this.model.scale * 0.8}px`,
        }, true);
    }
}