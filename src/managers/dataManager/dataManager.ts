import {PortfolioCanvas} from "../../components/canvas/canvas";
import {PortfolioFlowCard} from "../../components/card/types/flowCard/flowCard";
import {NavigationManager} from "../navigationManager/navigationManager";
import {PortfolioRootCard} from "../../components/card/types/rootCard/rootCard";
import {PortfolioCard} from "../../components/card/card";
import {PortfolioLinkData} from "../../components/linkButton/linkButton.types";

export class DataManager {
    public readonly canvas: PortfolioCanvas;
    private readonly navigationManager: NavigationManager;

    private readonly cards: PortfolioCard[];

    public constructor(canvas: PortfolioCanvas) {
        this.canvas = canvas;
        this.navigationManager = canvas.navigationManager;
        this.cards = [];
    }

    public async populate(dataFolderPath: string = "data") {
        if (dataFolderPath.length > 0 && !dataFolderPath.endsWith("/") && !dataFolderPath.endsWith("\\")) dataFolderPath += "/";
        const rootCard = await this.generateRootFrom(dataFolderPath + "root.json");
        this.canvas.toolbar.generateHomeButton(rootCard, this.navigationManager);
        this.cards.push(rootCard);

        rootCard.links.forEach((link, name) =>
            this.loadDataFromFile(dataFolderPath + name.toLowerCase() + ".json", link));

        setTimeout(() => this.cards.forEach(card => card.origin = card.origin), 500);
    }

    private async generateRootFrom(filePath: string): Promise<PortfolioRootCard> {
        try {
            const response = await fetch(filePath);
            const data = await response.json();
            return new PortfolioRootCard(this.navigationManager, data, {parent: this.canvas?.content});
        } catch (error) {
            console.error("Error loading portfolio data:", error);
            return undefined;
        }
    }

    private async loadDataFromFile(filePath: string, rootLink: PortfolioLinkData) {
        try {
            const response = await fetch(filePath);
            const data = await response.json();

            let previousEntry: PortfolioFlowCard;
            for (let i = 0; i < data.length; i++) {
                const entry = data[i];
                const startDate = entry.startDate ? new Date(entry.startDate) : undefined;
                const endDate = entry.endDate ? new Date(entry.endDate) : undefined;

                // Create a new PortfolioCard for each project
                const newCard = new PortfolioFlowCard(this.navigationManager,
                    {...entry, startDate: startDate, endDate: endDate, side: rootLink.side},
                    {parent: this.canvas?.content});
                newCard.previousLink.color = rootLink.color;
                newCard.nextLink.color = rootLink.color;
                this.cards.push(newCard);

                if (i == 0) {
                    newCard.previousLink.attachTo(rootLink.element?.parentCard, false);
                    rootLink.element?.attachTo(newCard);
                } else if (previousEntry) {
                    newCard.previousLink.attachTo(previousEntry, false);
                    previousEntry.nextLink.attachTo(newCard);
                }

                previousEntry = newCard;
            }
        } catch (error) {
            console.error("Error loading portfolio data:", error);
            return undefined;
        }
    }
}