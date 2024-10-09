import {PortfolioCanvas} from "../../components/canvas/canvas";
import {PortfolioFlowCard} from "../../components/card/types/flowCard/flowCard";
import {SideH} from "../../components/card/types/flowCard/flowCard.types";
import {NavigationManager} from "../navigationManager/navigationManager";
import {PortfolioRootCard} from "../../components/card/types/rootCard/rootCard";
import {PortfolioLinkButton} from "../../components/linkButton/linkButton";

export class DataManager {
    public readonly canvas: PortfolioCanvas;
    private readonly navigationManager: NavigationManager;

    public constructor(canvas: PortfolioCanvas) {
        this.canvas = canvas;
        this.navigationManager = canvas.navigationManager;
    }

    public async populate(dataFolderPath: string = "data") {
        if (dataFolderPath.length > 0 && !dataFolderPath.endsWith("/") && !dataFolderPath.endsWith("\\")) dataFolderPath += "/";
        const rootCard = await this.generateRootFrom(dataFolderPath + "root.json");

        rootCard.links.forEach((link, name) =>
            this.loadDataFromFile(dataFolderPath + name.toLowerCase() + ".json", link.element, link.side));
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

    private async loadDataFromFile(filePath: string, rootLink: PortfolioLinkButton, side: SideH = SideH.right) {
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
                    {...entry, startDate: startDate, endDate: endDate, side: side},
                    {parent: this.canvas?.content});

                if (i == 0) {
                    newCard.previousLink.attachTo(rootLink.parentCard, false);
                    rootLink.attachTo(newCard);
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