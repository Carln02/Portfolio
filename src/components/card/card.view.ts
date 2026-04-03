import {a, div, effect, h3, h4, p, Shown, StatefulReifect, turbo, TurboRichElement, TurboView} from "turbodombuilder";
import {PortfolioCarousel} from "../carousel/carousel";
import {Card} from "./card";
import {CardModel} from "./card.model";
import {getTagColor, Months} from "../../index";

export class CardView<
    ElementType extends Card = Card,
    ModelType extends CardModel = CardModel
> extends TurboView<ElementType, ModelType> {
    private carousel: PortfolioCarousel;
    private titleElement: HTMLElement;

    private locationElement: TurboRichElement;
    private awardedByElement: TurboRichElement;
    private typeElement: TurboRichElement;

    private dateElement: TurboRichElement;
    private linkElement: TurboRichElement;

    private tagsElement: HTMLElement;
    private descriptionElement: HTMLElement;

    public initialize() {
        super.initialize();
        this.model.generateObserver({
            onAdded: (data) => h4({
                text: data, classes: "card-tag",
                style: "borderColor: " + getTagColor(), parent: this.tagsElement
            })
        }, "tags");
    }

    protected setupUIElements() {
        this.carousel = PortfolioCarousel.create({data: this.model.images});
        this.titleElement = h3({classes: "card-title"});
        this.locationElement = TurboRichElement.create({leftIcon: "location", classes: "card-location"});
        this.descriptionElement = div({classes: "card-description"});

        this.dateElement = TurboRichElement.create({leftIcon: "clock", classes: "card-date"});
        this.awardedByElement = TurboRichElement.create({leftIcon: "award", classes: "card-awarded-by"});
        this.typeElement = TurboRichElement.create({leftIcon: "type", classes: "card-type"});

        this.tagsElement = div({classes: "card-tags"});
        this.linkElement = TurboRichElement.create({leftIcon: "link", classes: "card-link"});
        this.linkElement.element = a({target: "_blank"});
    }

    protected setupUILayout() {
        turbo(this).addChild([
            this.carousel,
            this.titleElement,
            div({
                classes: "card-info",
                children: [this.locationElement, this.dateElement, this.awardedByElement, this.typeElement, this.linkElement]
            }),
            this.tagsElement,
            this.descriptionElement
        ]);
    }

    @effect showCarousel() {
        turbo(this.carousel).show(this.model.images && this.model.images.length > 0);
    }

    @effect updateTitle() {
        turbo(this.titleElement).show(!!this.model.title);
        this.titleElement.textContent = this.model.title;
    }

    @effect updateLocation() {
        turbo(this.locationElement).show(!!this.model.location);
        this.locationElement.text = this.model.location;
    }

    @effect updateAwardedBy() {
        turbo(this.awardedByElement).show(!!this.model.awardedBy);
        this.awardedByElement.text = this.model.awardedBy;
    }

    @effect updateType() {
        turbo(this.typeElement).show(!!this.model.type);
        this.typeElement.text = this.model.type;
    }

    @effect updateLink() {
        turbo(this.linkElement).show(!!this.model.link);
        this.linkElement.element.textContent = this.model.linkText || "Link";
        this.linkElement.element.href = this.model.link;
    }

    @effect updateDescription() {
        turbo(this.descriptionElement).show(!!this.model.description);
        if (this.model.description) turbo(this.descriptionElement).removeAllChildren()
            .addChild(this.model.description.split(/<br\s*\/?>|\n/)
                .map(entry => p({innerHTML: entry})));
    }

    @effect updateDate() {
        turbo(this.dateElement).show(!!this.model.startDate);
        if (!this.model.startDate) return;
        let finalString = "";

        const startDateMonth = this.model.startDate.getMonth();
        const startDateYear = this.model.startDate.getFullYear();
        const endDateMonth = this.model.endDate ? this.model.endDate.getMonth() : undefined;
        const endDateYear = this.model.endDate ? this.model.endDate.getFullYear() : undefined;
        const sameDates = endDateMonth == startDateMonth && endDateYear == endDateYear;

        finalString += Months[startDateMonth - 1] + " ";
        if (endDateMonth === undefined || endDateYear !== startDateYear || sameDates) finalString += startDateYear + " ";

        if (!sameDates) {
            finalString += "→ ";
            if (endDateMonth === undefined) finalString += "Present";
            else finalString += Months[endDateMonth - 1] + " " + endDateYear;
        }

        this.dateElement.text = finalString;
    }

    @effect public updateOrigin() {
        turbo(this).setStyle("transform", `translate(${this.model.origin.x}px, ${this.model.origin.y}px)`);
    }
}