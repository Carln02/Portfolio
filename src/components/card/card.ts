import {
    Coordinate, DefaultEventName,
    define,
    Delegate,
    expose,
    Point,
    turbo,
    TurboDragEvent,
    TurboElement
} from "turbodombuilder";
import "./card.css";
import {CardView} from "./card.view";
import {CardModel} from "./card.model";
import {Canvas} from "../canvas/canvas";
import {CardData} from "./card.types";

@define("portfolio-card")
export class Card<
    ViewType extends CardView = CardView<any, any>,
    DataType extends CardData = CardData,
    ModelType extends CardModel = CardModel
> extends TurboElement<ViewType, DataType, ModelType> {
    @expose("model") public origin: Point;

    public readonly onMove: Delegate<(newPosition: Coordinate) => void> = new Delegate();

    public get canvas(): Canvas {
        return turbo(this).closest(Canvas);
    }

    public move(delta: Point) {
        this.origin = delta.add(this.origin);
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        turbo(this).on(DefaultEventName.drag, (e: TurboDragEvent) => this.move(e.scaledDeltaPosition));
    }
}