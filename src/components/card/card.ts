import {
    a, auto, Coordinate,
    define, Delegate, div,
    flexRow,
    h3,
    h4,
    p,
    richElement,
    TurboElement,
    TurboProperties,
    TurboRichElement
} from "turbodombuilder";
import {PortfolioCardData} from "./card.types";
import {PortfolioCarousel} from "../carousel/carousel";
import "./card.css";
import {NavigationManager} from "../../managers/navigationManager/navigationManager";

@define()
export class PortfolioCard extends TurboElement {
    private static months = ["Jan.", "Feb.", "Mar.", "Apr.", "May",
        "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."] as const;
    private static tagsColors = ["#12334e", "#4e124d",
        "#1a124e", "#124e4c", "#2f124e"] as const;

    protected readonly navigationManager: NavigationManager;
    protected readonly data: PortfolioCardData;

    private carousel: PortfolioCarousel | undefined;
    private titleElement: HTMLElement | undefined;

    private locationElement: TurboRichElement | undefined;
    private awardedByElement: TurboRichElement | undefined;

    private dateElement: TurboRichElement | undefined;
    private linkElement: TurboRichElement | undefined;

    private tagsElements: HTMLElement[];

    private descriptionElement: HTMLElement | undefined;

    public readonly onMove: Delegate<(newPosition: Coordinate) => void>;

    public constructor(navigationManager: NavigationManager, data: PortfolioCardData, properties?: TurboProperties) {
        super(properties);
        this.addClass("portfolio-card");

        this.navigationManager = navigationManager;
        this.data = data;

        this.setupUIElements();
        this.setupUILayout();

        this.onMove = new Delegate();
        this.origin = data.origin || {x: 0, y: 0};
    }

    @auto()
    public set origin(value: Coordinate) {
        this.setStyle("transform", `translate(${value.x}px, ${value.y}px)`);
        this.onMove.fire(value);
    }

    public translateBy(value: Coordinate) {
        this.origin = {x: this.origin.x + value.x, y: this.origin.y + value.y};
    }

    protected setupUIElements() {
        if (this.data.images) this.carousel = new PortfolioCarousel(this.data.images);
        if (this.data.title) this.titleElement = h3({text: this.data.title, classes: "card-title"});

        if (this.data.location) this.locationElement = richElement({
            element: this.data.location,
            leftIcon: "location", classes: "card-location"
        });
        if (this.data.startDate) this.setupDateElement();
        if (this.data.awardedBy) this.awardedByElement = richElement({
            element: this.data.awardedBy,
            leftIcon: "award", classes: "card-awarded-by"
        });

        if (this.data.link) this.linkElement = richElement({
            element: a({
                text: this.data.linkText || "Link",
                href: this.data.link
            }) as any, leftIcon: "link", classes: "card-link"
        });

        this.tagsElements = [];
        if (this.data.tags) this.data.tags.forEach(tag => this.tagsElements.push(
            h4({text: tag, classes: "card-tag"})
                .setStyle("backgroundColor", PortfolioCard.tagsColors[Math.floor(Math.random() * 5)])
        ));

        if (this.data.description) this.descriptionElement = div({
            classes: "card-description",
            children: this.data.description.split(/<br\s*\/?>|\n/).map(entry => p({innerHTML: entry}))
        });
    }

    private setupDateElement() {
        if (!this.data.startDate) return;
        let finalString = "";

        const startDateMonth = this.data.startDate.getMonth();
        const startDateYear = this.data.startDate.getFullYear();

        const endDateMonth = this.data.endDate ? this.data.endDate.getMonth() : undefined;
        const endDateYear = this.data.endDate ? this.data.endDate.getFullYear() : undefined;

        const sameDates = endDateMonth == startDateMonth && endDateYear == endDateYear;

        finalString += PortfolioCard.months[startDateMonth - 1] + " ";
        if (endDateMonth == undefined || endDateYear != startDateYear || sameDates) finalString += startDateYear + " ";

        if (!sameDates) {
            finalString += "→ ";
            if (endDateMonth == undefined) finalString += "Present";
            else finalString += PortfolioCard.months[endDateMonth - 1] + " " + endDateYear;
        }

        this.dateElement = new TurboRichElement({element: finalString, leftIcon: "clock", classes: "card-date"});
    }

    protected setupUILayout() {
        this.addChild(this.carousel);
        this.addChild(this.titleElement);

        if (this.locationElement || this.dateElement || this.linkElement) {
            const infoDiv = div({classes: "card-info", parent: this});
            if (this.locationElement) infoDiv.addChild(this.locationElement);
            if (this.dateElement) infoDiv.addChild(this.dateElement);
            if (this.awardedByElement) infoDiv.addChild(this.awardedByElement);
            if (this.linkElement) infoDiv.addChild(this.linkElement);
        }

        if (this.tagsElements.length > 0) {
            const tagsDiv = div({classes: "card-tags", parent: this});
            this.tagsElements.forEach(tag => tagsDiv.addChild(tag));
        }

        this.addChild(this.descriptionElement);
    }
}