import React from "react";
import logo from "../../assets/logo.svg";
import "./styles.css";
import { FiLogIn, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>

          <div className="actions">
            <Link to="/create-point" className="primary">
              <span>
                <FiLogIn />
              </span>
              <strong>Cadastre um ponto de coleta</strong>
            </Link>

            <Link to="/points" className="secondary">
              <span>
                <FiMapPin />
              </span>
              <strong>Ver pontos cadastrados</strong>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
