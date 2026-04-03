import {behavior, Propagation, TurboDragEvent} from "turbodombuilder";
import {TurboIconTool} from "./icon.tool";

export class MoveTool extends TurboIconTool {
    public toolName = "select";

    @behavior() public drag(e: TurboDragEvent, target: Node) {
        if ("move" in target && typeof target.move === "function") {
            target.move(e.scaledDeltaPosition);
            return Propagation.stopPropagation;
        }
    }
}
