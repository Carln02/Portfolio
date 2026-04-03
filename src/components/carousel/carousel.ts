import {
    define,
    div,
    button,
    TurboElement,
    TurboProperties,
    DefaultEventName,
    mod,
    img,
    Reifect,
    getFileExtension, video, element
} from "turbodombuilder";
import "./carousel.css";

@define()
export class PortfolioCarousel extends TurboElement {
    private readonly images: string[];

    private _currentIndex: number;

    private imageContainer: HTMLElement | undefined;
    private imageContainerTransition: Reifect;

    private dots: HTMLElement[] = [];

    constructor(images: string[], properties?: TurboProperties) {
        super(properties);
        this.addClass("portfolio-carousel");

        this.images = images;
        this.setupUILayout();
        this.currentIndex = 0;
    }

    protected setupUILayout() {
        this.imageContainer = div({classes: "carousel-image-container", parent: this});
        this.imageContainerTransition = new Reifect({
            transitionProperties: "transform",
            transitionDuration: 0.5,
            transitionTimingFunction: "ease-in-out",
        });

        this.imageContainerTransition.apply(this.imageContainer);

        this.images.forEach(imageUrl => this.createImage(imageUrl));

        if (this.images.length < 2) return;

        const prevButton = button({
            text: "Previous",
            classes: "carousel-prev",
            parent: this,
            listeners: {[DefaultEventName.click]: () => this.currentIndex--}
        });

        const nextButton = button({
            text: "Next",
            classes: "carousel-next",
            parent: this,
            listeners: {[DefaultEventName.click]: () => this.currentIndex++}
        });

        const dotsContainer = div({classes: "carousel-dots", parent: this});
        this.images.forEach((_, index) => this.dots.push(div({
            classes: `carousel-dot ${index === this.currentIndex ? "active" : ""}`,
            parent: dotsContainer,
            onclick: {[DefaultEventName.click]: () => this.currentIndex = index}
        })));
    }

    protected get currentIndex(): number {
        return this._currentIndex;
    }

    protected set currentIndex(index: number) {
        this._currentIndex = mod(index, this.images.length);
        this.imageContainer?.setStyle("transform", `translateX(${-this.currentIndex * 100}%)`);

        this.dots.forEach((dot, index) =>
            dot.toggleClass("active", index == this.currentIndex));
    }

    private createImage(imageUrl: string) {
        const extension = getFileExtension(imageUrl);
        if (extension == ".mp4" || extension == ".m4v") video({
            classes: "carousel-image", controls: true, parent: this.imageContainer, children: [
                element({tag: "source", type: "video/mp4", src: imageUrl})
            ]
        });
        else img({classes: "carousel-image", src: imageUrl, parent: this.imageContainer});
    }
}