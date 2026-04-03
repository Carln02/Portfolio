import {
    define,
    div,
    TurboElement,
    mod,
    img,
    Reifect,
    getFileExtension, video, element, signal, turbo, TurboModel, TurboButton, auto, effect
} from "turbodombuilder";
import "./carousel.css";

@define("portfolio-carousel")
export class PortfolioCarousel extends TurboElement {
    public static defaultProperties = {
        model: TurboModel
    };

    @signal public images: string[];

    @signal @auto({
        defaultValue: 0,
        preprocessValue: function (value) {
            return mod(value, this.images.length);
        }
    }) public currentIndex: number;

    private imageContainer: HTMLElement;
    private previousButton: TurboButton;
    private nextButton: TurboButton;
    private dotsContainer: HTMLElement;

    private dots: HTMLElement[] = [];

    public initialize() {
        super.initialize();
        this.model.generateObserver({onAdded: (data, _self, index: number) => this.createImage(data, index)});
    }

    protected setupUIElements() {
        super.setupUIElements();
        this.imageContainer = div({classes: "carousel-image-container"});
        new Reifect({
            transitionProperties: "transform",
            transitionDuration: 0.5,
            transitionTimingFunction: "ease-in-out",
        }).apply(this.imageContainer);

        this.previousButton = TurboButton.create<any>({
            text: "Previous",
            classes: "carousel-prev",
            onClick: () => this.currentIndex--
        });
        this.nextButton = TurboButton.create<any>({
            text: "Next",
            classes: "carousel-next",
            onClick: () => this.currentIndex++
        });

        this.dotsContainer = div({classes: "carousel-dots"});
    }

    protected setupUILayout() {
        super.setupUILayout();
        turbo(this).addChild([this.imageContainer, this.previousButton, this.nextButton, this.dotsContainer]);
    }

    @effect private currentIndexChanged() {
        turbo(this.imageContainer).setStyle("transform", `translateX(${-this.currentIndex * 100}%)`);
        this.dots.forEach((dot, index) =>
            turbo(dot).toggleClass("active", index == this.currentIndex));
    }

    private createImage(imageUrl: string, index: number) {
        const extension = getFileExtension(imageUrl);

        this.dots.push(div({
            classes: `carousel-dot ${index === this.currentIndex ? "active" : ""}`,
            parent: this.dotsContainer,
            onclick: () => this.currentIndex = index
        }));

        if (extension == ".mp4" || extension == ".m4v") return video({
            classes: "carousel-image", controls: true, parent: this.imageContainer, children: [
                element({tag: "source", type: "video/mp4", src: imageUrl})
            ]
        });
        return img({classes: "carousel-image", src: imageUrl, parent: this.imageContainer});
    }
}