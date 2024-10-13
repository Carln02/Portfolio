import {DefaultEventName, define, TurboButton, TurboDragEvent} from "turbodombuilder";
import {Tool} from "../tool/tool";
import {ToolType} from "../../managers/toolManager/toolManager.types";
import {PortfolioCard} from "../../components/card/card";
import {PortfolioRootCard} from "../../components/card/types/rootCard/rootCard";
import {NavigationManager} from "../../managers/navigationManager/navigationManager";

/**
 * @description Tool that allows user to select elements and move them around
 */
@define()
export class HomeButton extends TurboButton {
    private readonly navigationManager: NavigationManager;
    private readonly root: PortfolioRootCard;

    public constructor(rootCard: PortfolioRootCard, navigationManager: NavigationManager) {
        super({leftIcon: "home", classes: "portfolio-tool"});
        this.root = rootCard;
        this.navigationManager = navigationManager;

        this.addListener(DefaultEventName.click, () => {
            this.navigationManager.canvas.enableTransition(true);
            this.navigationManager.navigateTo(this.root);
        })
    }
}
