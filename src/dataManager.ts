import {Canvas} from "./components/canvas/canvas";
import {RootCard} from "./components/card/types/rootCard/rootCard";
import {FlowCard} from "./components/card/types/flowCard/flowCard";
import {Card} from "./components/card/card";
import {Toolbar} from "./components/toolbar/toolbar";
import {LinkButton} from "./components/linkButton/linkButton";
import {turbo} from "turbodombuilder";

export class DataManager {
    public readonly canvas: Canvas;
    public readonly toolbar: Toolbar;

    public constructor(canvas: Canvas, toolbar?: Toolbar) {
        this.canvas = canvas;
        this.toolbar = toolbar;
    }

    public async populate(dataFolderPath: string = "data") {
        if (dataFolderPath.length > 0 && !dataFolderPath.endsWith("/") && !dataFolderPath.endsWith("\\")) dataFolderPath += "/";
        const rootCard = await this.generateRootFrom(dataFolderPath + "root.json");
        this.toolbar?.generateHomeButton(rootCard);

        rootCard.linkButtons.forEach(linkButton =>
            this.loadDataFromFile(dataFolderPath + linkButton.name.toLowerCase() + ".json", linkButton, rootCard));

        setTimeout(() => rootCard.linkButtons.forEach(linkButton => linkButton.refreshConnection()), 100);
        setTimeout(() => rootCard.linkButtons.forEach(linkButton => linkButton.refreshConnection()), 200);
    }

    private async generateRootFrom(filePath: string): Promise<RootCard> {
        try {
            const response = await fetch(filePath);
            const data = await response.json();
            return RootCard.create({data, parent: this.canvas?.content});
        } catch (error) {
            console.error("Error loading portfolio data:", error);
            return undefined;
        }
    }

    private async loadDataFromFile(filePath: string, rootLinkButton: LinkButton, rootCard: Card) {
        try {
            const response = await fetch(filePath);
            const data = await response.json();

            let previousEntry: FlowCard;
            for (let i = 0; i < data.length; i++) {
                const entry = data[i];
                const startDate = entry.startDate ? new Date(entry.startDate) : undefined;
                const endDate = entry.endDate ? new Date(entry.endDate) : undefined;

                // Create a new PortfolioCard for each project
                const newCard = FlowCard.create({
                    data: {...entry, startDate: startDate, endDate: endDate, side: rootLinkButton.data.side},
                    parent: this.canvas?.content
                });

                newCard.previousLink.color = rootLinkButton.color;
                newCard.nextLink.color = rootLinkButton.color;
                newCard.previousLink.attachTo(previousEntry ? previousEntry : rootCard, false);
                (previousEntry?.nextLink ?? rootLinkButton).target = newCard;
                previousEntry = newCard;
            }
            turbo(previousEntry.nextLink).show(false);
        } catch (error) {
            console.error("Error loading portfolio data:", error);
            return undefined;
        }
    }
}