import {StatefulReifect, turbo, TurboIcon, TurboTool} from "turbodombuilder";

export class TurboIconTool extends TurboTool<TurboIcon> {
    private iconReifect: StatefulReifect;

    public initialize() {
        super.initialize();
        turbo(this.element).addClass("portfolio-tool");

        this.iconReifect = new StatefulReifect({
            states: ["selected", "deselected"],
            attachedObjects: [this.element],
            properties: state => this.element.icon = this.toolName + (state === "selected" ? "-filled" : "-outlined")
        });
    }

    public onActivate() {
        this.iconReifect.apply("selected", this.element);
    }

    public onDeactivate() {
        this.iconReifect.apply("deselected", this.element);
    }
}