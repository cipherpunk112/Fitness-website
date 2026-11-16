import { NavLink } from "react-router-dom";
import { useFitFlow } from "../context/FitFlowContext";

export default function Header() {
  const { totalPlaces } = useFitFlow();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink className="brand" to="/" aria-label="FitFlow home">
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          <span>
            FitFlow
            <small>Islamabad</small>
          </span>
        </NavLink>

        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/classes">Classes</NavLink>
          <NavLink className="plan-link" to="/booking">
            My plan <span aria-label={`${totalPlaces} selected places`}>{totalPlaces}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
