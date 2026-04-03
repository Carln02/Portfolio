import {auto, Coordinate, Point, signal, TurboModel} from "turbodombuilder";

export class CanvasModel extends TurboModel {
    //Translation and scale
    @signal public translation: Point = new Point(window.innerWidth / 2, window.innerHeight / 2);

    @signal @auto({
        defaultValue: 0.9,
        preprocessValue: function (value) {
            //Make sure the value is between the bounds. For some reason, removing the 0.01 offset on the bounds will
            // render the scaling stuck to one end when it is reached by the user.
            if (value > this.maxScale) return this.maxScale - 0.001;
            else if (value < this.minScale) return this.minScale + 0.001;
            else return value;
        }
    }) public scale: number;

    //Const fields representing the zoom intensity for different input devices
    public readonly zoomMouseIntensity = 0.1 as const;
    public readonly zoomTrackpadIntensity = 0.05 as const;
    public readonly zoomTouchIntensity = 0.005 as const;

    //Zooming bounds
    public readonly maxScale = 7.5 as const;
    public readonly minScale = 0.1 as const;

    public translate(delta: Coordinate) {
        if (!delta) return;
        this.translation = this.translation.add(delta);
    }
}