import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container state-card">
        <span className="state-code">404</span>
        <h1>This page is not part of the FitFlow schedule.</h1>
        <p>Check the address, return home, or browse the current fitness classes.</p>
        <div className="state-actions">
          <Link className="button primary" to="/classes">Browse classes</Link>
          <Link className="button secondary" to="/">Return home</Link>
        </div>
      </div>
    </section>
  );
}
