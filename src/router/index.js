import { createRouter, createWebHistory } from "vue-router";
import TownWeather from "../views/TownWeather";
import Hello from "../components/Hello";
import Forecastchartview from "../views/Forecastchartview";

const routes = [
    { path: "/", name: "home", component: Hello },
    { path: "/townweather", name: "townweatherhome", component: TownWeather },
    { path: "/townweather/:town", name: "townweather", component: TownWeather },
    { path: "/forecastchart", name: "forecastcharthome", component: Forecastchartview },
    { path: "/forecastchart/:town", name: "forecastchart", component: Forecastchartview }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;