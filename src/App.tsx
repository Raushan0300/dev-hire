// src/App.tsx
import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./routes";

const AppRoutes = () => {
  const element = useRoutes(routes);
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      {element}
    </React.Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;