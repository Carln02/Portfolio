import {Point, Shown, turbo, TurboEventManager, TurboIcon} from "turbodombuilder";
import {Canvas} from "./components/canvas/canvas";
import {DataManager} from "./dataManager";
import "./vars.css";
import "./main.css";
import {Toolbar} from "./components/toolbar/toolbar";
import {MoveTool} from "./tools/select.tool";
import {NavigatorTool} from "./tools/navigator.tool";

TurboIcon.config.defaultDirectory = "assets/icons";
TurboIcon.config.defaultClasses = "icon";

export const Months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."] as const;
export const TagColors = ["#12334e", "#4e124d", "#1a124e", "#124e4c", "#2f124e"] as const;
export const TagColorsLight = ["#34b5b2", "#2a8dc8", "#2652ca",
    "#5241e3", "#873fd6", "#ca3ec5"] as const;

export function getTagColor() {
    return TagColorsLight[Math.floor(Math.random() * TagColorsLight.length)];
}

const canvas = Canvas.create({parent: document.body});
turbo(canvas).showTransition.styles = state => `display: ${state === Shown.hidden ? "none" : ""};`;
TurboEventManager.instance.scaleEventPosition = (position: Point) => canvas.scalePosition(position);
TurboEventManager.instance.preventDefaultWheel = true;

document.addEventListener("wheel", (e) => e.preventDefault(), {passive: false});
document.addEventListener("gesturestart", (e) => e.preventDefault(), {passive: false});
document.addEventListener("gesturechange", (e) => e.preventDefault(), {passive: false});

// const toolbar = Toolbar.create({parent: document.body});
// toolbar.canvas = canvas;
// toolbar.addTools(
//     // TurboIcon.create({tools: MoveTool}),
//     // TurboIcon.create({tools: NavigatorTool})
// );

new DataManager(canvas).populate();