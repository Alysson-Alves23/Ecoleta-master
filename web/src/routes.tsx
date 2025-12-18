import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import CreatePoint from "./pages/CreatePoint";
import Points from "./pages/Points";
import PointDetail from "./pages/PointDetail";

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/create-point" exact component={CreatePoint} />
      <Route path="/points" exact component={Points} />
      <Route path="/points/:id" exact component={PointDetail} />
    </BrowserRouter>
  );
};

export default Routes;
