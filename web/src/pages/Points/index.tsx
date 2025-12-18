import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import api from "../../services/api";
import logo from "../../assets/logo.svg";
import "./styles.css";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

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
  city: string;
  uf: string;
}

const Points: React.FC = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        setUfs(response.data.map((uf) => uf.sigla));
      })
      .catch((err) => {
        console.error("Falha ao carregar UFs do IBGE:", err);
        setUfs([]);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      setCities([]);
      setSelectedCity("0");
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        setCities(response.data.map((city) => city.nome));
      })
      .catch((err) => {
        console.error("Falha ao carregar cidades do IBGE:", err);
        setCities([]);
      });
  }, [selectedUf]);

  useEffect(() => {
    api
      .get<Item[]>("/items")
      .then((response) => setItems(response.data))
      .catch((err) => {
        console.error("Falha ao carregar itens da API:", err);
        setItems([]);
      });
  }, []);

  function toggleSelectedItem(id: number) {
    setSelectedItems((prev) => {
      const alreadySelected = prev.includes(id);
      if (alreadySelected) return prev.filter((itemId) => itemId !== id);
      return [...prev, id];
    });
  }

  async function handleSearch() {
    if (selectedUf === "0" || selectedCity === "0" || selectedItems.length === 0) {
      setPoints([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get<Point[]>("/points", {
        params: {
          uf: selectedUf,
          city: selectedCity,
          items: selectedItems.join(","),
        },
      });
      setPoints(response.data);
    } catch (err) {
      console.error("Falha ao buscar pontos:", err);
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="page-points">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">Voltar para Home</Link>
      </header>

      <main>
        <h1>Buscar pontos de coleta</h1>
        <p>Selecione UF, cidade e os itens para listar os pontos cadastrados.</p>

        <div className="filters">
          <div className="field">
            <label htmlFor="uf">UF</label>
            <select
              name="uf"
              id="uf"
              value={selectedUf}
              onChange={(e) => setSelectedUf(e.target.value)}
            >
              <option value="0">Selecione uma UF</option>
              {ufs.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="city">Cidade</label>
            <select
              name="city"
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="0">Selecione uma cidade</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2>Ítens de Coleta</h2>
        <ul className="items-grid">
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => toggleSelectedItem(item.id)}
              className={selectedItems.includes(item.id) ? "selected" : ""}
            >
              <img src={item.image_url} alt={item.title} />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>

        <button type="button" onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar pontos"}
        </button>

        <section className="results">
          <h2>Resultados</h2>
          {points.length === 0 ? (
            <p className="muted">Nenhum ponto encontrado (ou filtros incompletos).</p>
          ) : (
            <ul className="points-list">
              {points.map((point) => (
                <li key={point.id}>
                  <img src={point.image_url} alt={point.name} />
                  <div>
                    <strong>{point.name}</strong>
                    <span>
                      {point.city}/{point.uf}
                    </span>
                    <small>ID: {point.id}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Points;


