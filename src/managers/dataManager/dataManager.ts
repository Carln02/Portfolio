import {PortfolioCanvas} from "../../components/canvas/canvas";
import {PortfolioCard} from "../../components/card/card";

export class DataManager {
    public canvas: PortfolioCanvas;

    public constructor(canvas: PortfolioCanvas) {
        this.canvas = canvas;
    }

    public populate() {
        this.loadDataFromFile("data/projects.json");
    }

    private loadDataFromFile(filePath: string) {
        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                data.forEach((entry: any) => {
                    const startDate = entry.startDate ? new Date(entry.startDate) : undefined;
                    const endDate = entry.endDate ? new Date(entry.endDate) : undefined;

                    // Create a new PortfolioCard for each project
                    new PortfolioCard({...entry, startDate: startDate, endDate: endDate,},
                        { parent: this.canvas?.content });
                });
            })
            .catch(error => console.error("Error loading portfolio data:", error));
    }
}