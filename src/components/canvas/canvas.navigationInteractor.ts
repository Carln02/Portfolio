import {
    DefaultEventName,
    listener,
    Point,
    turbo,
    TurboDragEvent, TurboEventName,
    TurboInteractor,
    TurboWheelEvent
} from "turbodombuilder";
import {Canvas} from "./canvas";
import {CanvasView} from "./canvas.view";
import {CanvasModel} from "./canvas.model";

export class CanvasNavigationInteractor extends TurboInteractor<Canvas, CanvasView, CanvasModel> {
    private willChangeTimeout: NodeJS.Timeout = null;

    public accessor target = document;

    @listener() trackpadScroll(e: TurboWheelEvent) {this.pan(e);}
    @listener() trackpadPinch(e: TurboWheelEvent) {this.zoom(e, true);}
    @listener() mouseWheel(e: TurboWheelEvent) {this.zoom(e);}

    public pan(e: TurboWheelEvent | TurboDragEvent) {
        this.element.enableTransition(false);
        this.fireWillChangeTimeout();
        this.model.translate(e instanceof TurboWheelEvent
            ? new Point(-e.delta?.x, -e.delta?.y)
            : e.scaledDeltaPosition?.mul(this.model.scale));
    }

    /**
     * @description Zooms the canvas
     * @param e
     * @param isTrackpad
     */
    public zoom(e: TurboWheelEvent | TurboDragEvent, isTrackpad: boolean = false) {
        this.element.enableTransition(false);
        this.fireWillChangeTimeout();

        const oldScale: number = this.model.scale;
        let zoomOrigin = new Point(window.innerWidth / 2, window.innerHeight / 2).sub(this.model.translation);

        //Touch Event
        if (e instanceof TurboDragEvent) {
            const positionsArray = e.scaledPositions.valuesArray();
            const previousPositionsArray = e.scaledPreviousPositions.valuesArray();
            zoomOrigin = Point.midPoint(...positionsArray).mul(this.model.scale);
            this.model.scale += this.model.scale * this.model.scale * (Point.dist(positionsArray[0], positionsArray[1]) -
                Point.dist(previousPositionsArray[0], previousPositionsArray[1])) * this.model.zoomTouchIntensity;
        }

        //Trackpad
        else if (isTrackpad) this.model.scale -= this.model.scale * e.delta.y * this.model.zoomTrackpadIntensity;

        //Mouse Wheel
        else this.model.scale -= this.model.scale * (e.delta.y > 0 ? 1 : -1) * this.model.zoomMouseIntensity;

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