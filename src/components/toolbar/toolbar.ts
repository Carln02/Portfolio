import {define, TurboElement, TurboProperties, DefaultEventName, ClickMode} from "turbodombuilder";
import {ToolManager} from "../../managers/toolManager/toolManager";
import {ToolType} from "../../managers/toolManager/toolManager.types";
import {ToolView} from "../../tools/tool/toolView";
import "./toolbar.css";

@define()
export class PortfolioToolbar extends TurboElement {
    private toolManager: ToolManager;

    public constructor(toolManager: ToolManager, properties: TurboProperties = {}) {
        super(properties);
        this.toolManager = toolManager;
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