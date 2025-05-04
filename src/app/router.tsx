import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { NetWealth } from "capabilities/net-wealth";
import { ProjectedIncome } from "capabilities/projected-income";
import { ProjectedWealth } from "capabilities/projected-wealth";
import { App } from "./app";

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/net-wealth" });
  },
});

const netWealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/net-wealth",
  component: NetWealth,
});

const projectedIncomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projected-income",
  component: ProjectedIncome,
});

const projectedWealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projected-wealth",
  component: ProjectedWealth,
});

const routeTree = rootRoute.addChildren([indexRoute, netWealthRoute, projectedIncomeRoute, projectedWealthRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  basepath: "/wealth-tracker",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
