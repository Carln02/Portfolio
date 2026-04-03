import {DefaultEventName, effect, element, Point, SideH, SvgNamespace, turbo, TurboView} from "turbodombuilder";
import {LinkButton} from "./linkButton";
import {LinkButtonModel} from "./linkButton.model";
import {ButtonLinkColor} from "./linkButton.types";
import * as d3 from "d3";

export class LinkButtonView extends TurboView<LinkButton, LinkButtonModel> {
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    private readonly chevronShape = "M -11 -9 L 1 0 L -12 9" as const;

    private readonly viewBoxPadding = 50 as const;
    private lastViewBoxUpdate: number = 0;
    private viewBoxUpdateRate: number = 0;
    private lastViewBoxValues: Point = new Point();

    protected setupUIElements() {
        super.setupUIElements();
        this.svg = d3.create("svg").attr("class", "link-path");
    }

    protected setupUILayout() {
        super.setupUILayout();
    }

    protected setupUIListeners() {
        super.setupUIListeners();
        turbo(this).on(DefaultEventName.click, () => {
            if (!this.model.target) return;
            const canvas = this.element.canvas;
            if (!canvas) return;
            canvas.enableTransition(true);
            canvas.navigateTo(this.model.target);
        });
    }

    @effect private updateName() {
        this.element.text = this.model.name;
    }

    @effect private updateSide() {
        turbo(this.element.rightIcon).show(this.model.side == SideH.right);
        turbo(this.element.leftIcon).show(this.model.side == SideH.left);
    }

    @effect private updateRank() {
        turbo(this).toggleClass("primary-button", this.model.rank == 1)
            .toggleClass("secondary-button", this.model.rank == 2)
            .toggleClass("tertiary-button", this.model.rank == 3 || !this.model.rank);
    }

    @effect private updateColor() {
        turbo(this).toggleClass("purple-button", this.model.color == ButtonLinkColor.purple)
            .toggleClass("blue-button", this.model.color == ButtonLinkColor.blue)
            .toggleClass("green-button", this.model.color == ButtonLinkColor.green || !this.model.color);
    }

    @effect public refreshConnection() {
        const svgNode = this.svg?.node();
        if (!svgNode) return;
        turbo(svgNode).removeAllChildren();
        if (!this.model.showConnection) return;
        if (!svgNode.parentElement) turbo(svgNode).addToParent(this.element.canvas?.content);

        this.model.target;
        this.model.target?.origin;

        requestAnimationFrame(() => requestAnimationFrame(() => {
            const cardRect = this.model.target?.getBoundingClientRect();
            const buttonRect = this.element.getBoundingClientRect();
            if (!cardRect) return;

            const cardPosition = this.element.canvas?.getPositionOf(this.model.target, {
                x: cardRect.x > buttonRect.x + buttonRect.width ? 0
                    : cardRect.x + cardRect.width < buttonRect.x ? 1
                        : 0.5,
                y: cardRect.x > buttonRect.x + buttonRect.width || cardRect.x + cardRect.width < buttonRect.x ? 0
                    : cardRect.y > buttonRect.y ? 0
                        : 1
            }).add(0, 40);

            const buttonPosition = this.element.canvas?.getPositionOf(this.element, {
                x: cardRect.x > buttonRect.x + buttonRect.width ? 1
                    : cardRect.x + cardRect.width < buttonRect.x ? 0
                        : 0.5,
                y: cardRect.x > buttonRect.x + buttonRect.width || cardRect.x + cardRect.width < buttonRect.x ? 0.5
                    : cardRect.y > buttonRect.y ? 1
                        : 0
            });

            this.createSCurve(buttonPosition, cardPosition);
            this.updateViewBox(buttonPosition, cardPosition);
        }));
    }

    private updateViewBox(start: Point, end: Point) {
        if (Date.now() - this.lastViewBoxUpdate <= this.viewBoxUpdateRate) return;
        this.lastViewBoxUpdate = Date.now();
        [start, end].forEach(p => this.lastViewBoxValues = Point.max(this.lastViewBoxValues, p.abs));

        const width = this.lastViewBoxValues.x * 2 + this.viewBoxPadding * 2;
        const height = this.lastViewBoxValues.y * 2 + this.viewBoxPadding * 2;
        this.svg.attr("width", width).attr("height", height)
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`);
    }

    private createSCurve(start: Point, end: Point) {
        const color = `var(--${this.model.color}-primary-color)`;
        const control1 = {x: start.x + (end.x - start.x) / 2, y: start.y};
        const control2 = {x: end.x - (end.x - start.x) / 2, y: end.y};
        const pathData = `M${start.x},${start.y} C${control1.x},${control1.y} ${control2.x},${control2.y} ${end.x},${end.y}`;

        const path = this.svg.append("path")
            .attr("d", pathData)
            .style("stroke", color)
            .style("fill", "transparent")
            .style("stroke-width", "2");

        const pathNode = path.node();
        const pathLength = pathNode.getTotalLength();

        this.drawChevron(pathNode.getPointAtLength(pathLength / 2), pathNode.getPointAtLength(pathLength / 2 + 1), color);
        this.drawChevron(pathNode.getPointAtLength(pathLength - 1), pathNode.getPointAtLength(pathLength), color);
    }

    private drawChevron(point: DOMPoint, nextPoint: DOMPoint, color: string) {
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

        this.svg.append("path")
            .attr("d", this.chevronShape)
            .attr("transform", `translate(${point.x}, ${point.y}) rotate(${angle})`)
            .style("stroke", color)
            .style("fill", "transparent")
            .style("stroke-width", "2");
    }
}