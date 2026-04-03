import {behavior, TurboDragEvent} from "turbodombuilder";
import {Canvas} from "../components/canvas/canvas";
import {TurboIconTool} from "./icon.tool";

export class NavigatorTool extends TurboIconTool {
    public toolName = "navigator";

    @behavior() public drag(e: TurboDragEvent, target: Node) {
        if (target instanceof Canvas) {
            //On drag --> pan and (if two touch points) zoom
            target.pan(e);
            if (e.positions.valuesArray().length > 1) target.zoom(e);
        }
    }
}
