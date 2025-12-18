import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Map, TileLayer, Marker } from "react-leaflet";

import api from "../../services/api";
import logo from "../../assets/logo.svg";
import "./styles.css";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  image: string;
  image_url: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
}

interface PointItem {
  title: string;
}

interface ShowPointResponse {
  point: Point;
  items: PointItem[];
}

interface RouteParams {
  id: string;
}

const PointDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [point, setPoint] = useState<Point | null>(null);
  const [pointItems, setPointItems] = useState<PointItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Item[]>("/items")
      .then((response) => setAllItems(response.data))
      .catch((err) => {
        console.error("Falha ao carregar itens:", err);
        setAllItems([]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get<ShowPointResponse>(`/points/${id}`)
      .then((response) => {
        setPoint(response.data.point);
        setPointItems(response.data.items);
      })
      .catch((err) => {
        console.error("Falha ao carregar ponto:", err);
        setPoint(null);
        setPointItems([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const selectedTitles = useMemo(
    () => new Set(pointItems.map((i) => i.title)),
    [pointItems]
  );

  const selectedItems = useMemo(
    () => allItems.filter((i) => selectedTitles.has(i.title)),
    [allItems, selectedTitles]
  );

  if (loading) {
    return (
      <div id="page-point-detail">
        <header>
          <img src={logo} alt="Ecoleta" />
          <Link to="/points">Voltar</Link>
        </header>
        <main>
          <p className="muted">Carregando...</p>
        </main>
      </div>
    );
  }

  if (!point) {
    return (
      <div id="page-point-detail">
        <header>
          <img src={logo} alt="Ecoleta" />
          <Link to="/points">Voltar</Link>
        </header>
        <main>
          <h1>Ponto não encontrado</h1>
          <p className="muted">Verifique o ID e tente novamente.</p>
        </main>
      </div>
    );
  }

  return (
    <div id="page-point-detail">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/points">Voltar</Link>
      </header>

      <main>
        <h1>{point.name}</h1>
        <p className="muted">
          {point.city}/{point.uf} • ID {point.id}
        </p>

        <div className="hero">
          <img className="hero-image" src={point.image_url} alt={point.name} />
          <div className="hero-info">
            <strong>Contato</strong>
            <span>{point.email}</span>
            <span>{point.whatsapp}</span>
          </div>
        </div>

        <fieldset>
          <legend>
            <h2>Localização</h2>
            <span>Visualização do ponto no mapa</span>
          </legend>

          <Map center={[point.latitude, point.longitude]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[point.latitude, point.longitude]} />
          </Map>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Itens associados a este ponto</span>
          </legend>

          <ul className="items-grid">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <li key={item.id} className="selected">
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))
            ) : (
              <li className="empty">
                <span>Nenhum item associado.</span>
              </li>
            )}
          </ul>
        </fieldset>
      </main>
    </div>
  );
};

export default PointDetail;


