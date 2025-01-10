import { LazyExoticComponent } from "react";

export interface RouteConfig {
    path: string;
    element: LazyExoticComponent<any>;
    layout?: LazyExoticComponent<any>;
}