import {Point, TurboEventManager, turbofy, TurboIcon} from "turbodombuilder";
import {PortfolioCanvas} from "./components/canvas/canvas";
import {ToolManager} from "./managers/toolManager/toolManager";
import {NavigationManager} from "./managers/navigationManager/navigationManager";
import {DataManager} from "./managers/dataManager/dataManager";
import "./vars.css";
import "./main.css";

turbofy();

TurboIcon.config.defaultDirectory = "assets/icons";
TurboIcon.config.defaultClasses = "icon";

const navigationManager = new NavigationManager();
const toolManager: ToolManager = new ToolManager(navigationManager);

const canvas: PortfolioCanvas = new PortfolioCanvas(navigationManager, toolManager);
navigationManager.canvas = canvas;

const eventManager = new TurboEventManager({
    preventDefaultTouch: true,
    preventDefaultMouse: true,
    preventDefaultWheel: true,
    scaleEventPosition: (position: Point) => navigationManager.computePositionRelativeToCanvas(position),
});

const dataManager = new DataManager(canvas);
dataManager.populate();