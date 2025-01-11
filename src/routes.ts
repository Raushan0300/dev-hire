import React from "react";
import { Navigate } from "react-router-dom";
import { isSignedIn } from "./lib/auth";

const modules = import.meta.glob<{ default: React.ComponentType<any> }>("./pages/**/*.tsx");

function wrapWithLayout(Component: any, Layout: any) {
    return React.createElement(
        React.Suspense,
        {
            fallback: React.createElement(
                "div",
                { className: "min-h-screen flex items-center justify-center" },
                React.createElement("div", {
                    className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900",
                })
            ),
        },
        Layout
            ? React.createElement(Layout, null, React.createElement(Component))
            : React.createElement(Component)
    );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const authenticated = isSignedIn(); // Synchronously checks token presence
    return authenticated
        ? children
        : React.createElement(Navigate, { to: "/auth", replace: true });
}

const routes = Object.keys(modules).map((path) => {
    const routePath = path
        .replace("./pages", "")
        .replace(/\/index\.tsx$/, "/")
        .replace(/\.tsx$/, "")
        .replace(/\[([^\]]+)\]/g, ":$1");

    const layoutPath = path.split("/").slice(0, -1).join("/") + "/_layout.tsx";
    const Layout = modules[layoutPath] ? React.lazy(modules[layoutPath]) : null;

    const Component = React.lazy(modules[path]);

    const wrappedElement = wrapWithLayout(Component, Layout);

    const element =
        routePath !== "/" && routePath !== "/auth"
            ? React.createElement(ProtectedRoute, null, wrappedElement)
            : wrappedElement;

    return {
        path: routePath === "" ? "/" : routePath,
        element,
    };
});

export default routes;