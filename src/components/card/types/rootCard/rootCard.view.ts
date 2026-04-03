import {div, effect, h2, img, SideH, spacer, turbo, TurboObserver} from "turbodombuilder";
import {CardView} from "../../card.view";
import {RootCard} from "./rootCard";
import {RootCardModel} from "./rootCard.model";
import {ButtonLinkColor, LinkData} from "../../../linkButton/linkButton.types";
import {LinkButton} from "../../../linkButton/linkButton";

export class RootCardView extends CardView<RootCard, RootCardModel> {
    private profilePicture: HTMLImageElement;
    private linksParent: HTMLElement;
    private links: TurboObserver;

    protected setupUIElements() {
        super.setupUIElements();
        this.profilePicture = img({alt: "profile picture"});
        this.linksParent = div({classes: "card-buttons"});
    }

    protected setupUILayout() {
        turbo(this).addChild(div({
            classes: "card-title-div",
            children: [h2({text: "Hey!"}), spacer(), this.profilePicture]
        }));
        super.setupUILayout();
        turbo(this).addChild(this.linksParent)
    }

    public initialize() {
        super.initialize();
        this.links = this.model.generateObserver({
            onAdded: (link: LinkData) => LinkButton.create({
                data: link, parent: this.linksParent, color: link.rank == 1 ? ButtonLinkColor.purple
                    : link.rank == 2 ? ButtonLinkColor.blue : ButtonLinkColor.green})
        }, "links");
    }

    public get linkButtons(): LinkButton[] {
        return this.links?.values;
    }

    @effect updateProfilePicture() {
        this.profilePicture.src = this.model.profilePicture;
    }

    @effect updateOrigin() {
        super.updateOrigin();
        this.links?.values.forEach((link: LinkButton) => link.refreshConnection());
    }
}