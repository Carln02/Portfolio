import {define, TurboDragEvent} from "turbodombuilder";
import {Tool} from "../tool/tool";
import {ToolType} from "../../managers/toolManager/toolManager.types";
import {PortfolioCard} from "../../components/card/card";

/**
 * @description Tool that allows user to select elements and move them around
 */
@define()
export class MoveTool extends Tool {
    private currentTarget: Element;

    constructor() {
        super(ToolType.move);
    }

    public dragStart(e: TurboDragEvent) {
        const closestCard = e.closest(PortfolioCard);
        if (closestCard) this.currentTarget = closestCard;
    }

    public dragAction(e: TurboDragEvent) {
        if (this.currentTarget instanceof PortfolioCard) {
            this.currentTarget.translateBy(e.scaledDeltaPosition);
        }
    }

    public dragEnd(e: TurboDragEvent) {
        this.currentTarget = null;
    }
}
