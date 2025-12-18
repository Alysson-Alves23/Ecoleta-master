import React from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige o ícone padrão do Marker do Leaflet em builds (CRA/webpack),
// onde os PNGs não são resolvidos automaticamente.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import Routes from "./routes";

// @ts-ignore - compatibilidade com typings antigos
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  return <Routes />;
}

export default App;
