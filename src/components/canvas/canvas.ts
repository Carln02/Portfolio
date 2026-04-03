import {
    Coordinate,
    define,
    expose, interactor,
    Point,
    Reifect, turbo,
    TurboElement, TurboWheelEvent
} from "turbodombuilder";
import "./canvas.css";
import {CanvasView} from "./canvas.view";
import {CanvasModel} from "./canvas.model";
import {CanvasNavigationInteractor} from "./canvas.navigationInteractor";

/**
 * @description Class representing a canvas on which the user can add cards, connect them, move them around, etc.
 */
@define("portfolio-canvas")
export class Canvas extends TurboElement<CanvasView, any, CanvasModel> {
    @expose("model") public translation: Point;
    @expose("model") public scale: number;
    @expose("view") public content: HTMLElement;

    public static defaultProperties = {
        model: CanvasModel,
        view: CanvasView,
        interactors: CanvasNavigationInteractor
    };

    //Canvas's attached navigation manager
    @interactor() protected navigationInteractor: CanvasNavigationInteractor;

    // private transition: Reifect;

    public initialize() {
        // this.transition = new Reifect({
        //     transitionProperties: "transform",
        //     transitionDuration: 0.3,
        //     transitionTimingFunction: "ease-out",
        // });
        super.initialize();
    }

    public enableTransition(b: boolean) {
        turbo(this.view.content).setStyle("transition", b ? "transform 0.3s ease-out" : "");
        // this.transition.enabled.transition = b;
        // this.transition.apply(this.view.content);
    }

    /**
     * @description Offset a given screen position by the canvas's translation.
     * @param {Point} screenPosition
     */
    public scalePosition(screenPosition: Point) {
        return screenPosition?.sub(this.translation).div(this.scale);
    }

    public pan(e: TurboWheelEvent) {
        this.navigationInteractor.pan(e);
    }

    public zoom(e: TurboWheelEvent) {
        this.navigationInteractor.zoom(e);
    }

    public navigateTo(element: Element, offset: Coordinate = {x: 0.5, y: 0.5}) {
        const rect = element.getBoundingClientRect();
        const deltaPosition = new Point(window.innerWidth * offset.x, window.innerHeight * offset.y)
            .sub(rect.left + rect.width * offset.x, rect.top + rect.height * offset.y);

        this.model.translate(deltaPosition);
    }

    public getPositionOf(element: Element, offset: Coordinate = {x: 0, y: 0}): Point {
        const canvasRect = this.view.content.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        const deltaPosition =  new Point(rect.x + rect.width * offset.x, rect.y + rect.height * offset.y)
            .sub(canvasRect.x * 2, canvasRect.y * 2)

        return this.translation.add(deltaPosition).div(this.scale);
    }
}
