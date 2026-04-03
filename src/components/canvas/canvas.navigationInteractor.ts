import {
    ClickMode,
    InputDevice,
    listener,
    Point,
    turbo,
    TurboInteractor,
    TurboWheelEvent
} from "turbodombuilder";
import {Canvas} from "./canvas";
import {CanvasView} from "./canvas.view";
import {CanvasModel} from "./canvas.model";

export class CanvasNavigationInteractor extends TurboInteractor<Canvas, CanvasView, CanvasModel> {
    private willChangeTimeout: NodeJS.Timeout = null;

    public accessor target = document;

    @listener() scroll(e: TurboWheelEvent) {this.pan(e);}
    @listener() pinch(e: TurboWheelEvent) {
        if (e.inputDevice === InputDevice.touch && e.clickMode === ClickMode.left) return;
        this.zoom(e);
    }

    public pan(e: TurboWheelEvent) {
        this.element.enableTransition(false);
        this.fireWillChangeTimeout();
        this.model.translate(e.inputDevice === InputDevice.touch
            ? e.delta
            : new Point(-e.delta?.x, -e.delta?.y));
    }

    /**
     * @description Zooms the canvas
     * @param e
     */
    public zoom(e: TurboWheelEvent) {
        this.element.enableTransition(false);
        this.fireWillChangeTimeout();

        const oldScale: number = this.model.scale;
        const zoomOrigin = new Point(window.innerWidth / 2, window.innerHeight / 2).sub(this.model.translation);

        if (e.inputDevice === InputDevice.touch)
            this.model.scale += this.model.scale * e.delta.y * this.model.zoomTouchIntensity;
        else
            this.model.scale -= this.model.scale * e.delta.y * this.model.zoomTrackpadIntensity;

        //Translate the viewport to make the zooming origin from the center of the screen
        this.model.translate(zoomOrigin.mul(1 - this.model.scale / oldScale));
    }

    private fireWillChangeTimeout() {
        if (this.willChangeTimeout) clearTimeout(this.willChangeTimeout);
        this.willChangeTimeout = setTimeout(() => {
            turbo(this.view.content).setStyle("willChange", "");
            requestAnimationFrame(() => turbo(this.view.content).setStyle("willChange", "transform"));
        }, 200);
    }
}