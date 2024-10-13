import {define, TurboElement, TurboProperties, DefaultEventName, ClickMode, div} from "turbodombuilder";
import {ToolManager} from "../../managers/toolManager/toolManager";
import {ToolType} from "../../managers/toolManager/toolManager.types";
import {ToolView} from "../../tools/tool/toolView";
import "./toolbar.css";
import {PortfolioRootCard} from "../card/types/rootCard/rootCard";
import {HomeButton} from "../../tools/home/home";
import {NavigationManager} from "../../managers/navigationManager/navigationManager";

@define()
export class PortfolioToolbar extends TurboElement {
    private toolManager: ToolManager;

    public constructor(toolManager: ToolManager, properties: TurboProperties = {}) {
        super(properties);
        this.toolManager = toolManager;
    }

    public generateHomeButton(rootCard: PortfolioRootCard, navigationManager: NavigationManager) {
        this.addChild([new HomeButton(rootCard, navigationManager), div({classes: "toolbar-separator"})], 0);
    }

    public populateWith(...names: ToolType[]) {
        names.forEach(name => this.addToolInstance(this.toolManager.getToolByName(name)?.createInstance()));
    }

    public populateWithAllTools() {
        this.toolManager.getToolsArray().forEach(tool => this.addToolInstance(tool.createInstance()));
    }

    private addToolInstance(tool: ToolView) {
        tool.addEventListener(DefaultEventName.click, (e) => {
            this.toolManager.setTool(tool.tool, ClickMode.left);
            e.stopImmediatePropagation();
        });

        this.addChild(tool);
    }
}