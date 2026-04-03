import {Coordinate} from "turbodombuilder";

export type PortfolioCardData = {
    origin?: Coordinate;

    images?: string[];

    title?: string;
    location?: string;
    awardedBy?: string;

    startDate?: Date,
    endDate?: Date,

    link?: string;
    linkText?: string;

    tags?: string[];

    description?: string;
}