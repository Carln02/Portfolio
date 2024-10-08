import {PortfolioCanvas} from "../../components/canvas/canvas";
import {PortfolioFlowCard} from "../../components/card/types/flowCard/flowCard";
import {SideH} from "../../components/card/types/flowCard/flowCard.types";
import {NavigationManager} from "../navigationManager/navigationManager";

export class DataManager {
    public canvas: PortfolioCanvas;
    private navigationManager: NavigationManager;

    public constructor(canvas: PortfolioCanvas) {
        this.canvas = canvas;
        this.navigationManager = canvas.navigationManager;
    }

    public populate() {
        this.loadDataFromFile("data/projects.json");
    }

    private loadDataFromFile(filePath: string) {
        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                let previousEntry: PortfolioFlowCard;

                for (const entry of data) {
                    const startDate = entry.startDate ? new Date(entry.startDate) : undefined;
                    const endDate = entry.endDate ? new Date(entry.endDate) : undefined;

                    // Create a new PortfolioCard for each project
                    const newCard = new PortfolioFlowCard(this.navigationManager,
                        {...entry, startDate: startDate, endDate: endDate, side: SideH.right},
                        {parent: this.canvas?.content});

                    if (previousEntry) {
                        newCard.previousLink.attachTo(previousEntry, false);
                        previousEntry.nextLink.attachTo(newCard);
                    }

                    previousEntry = newCard;
                }

                previousEntry.nextLink.show(false);
            })
            .catch(error => console.error("Error loading portfolio data:", error));
    }
}