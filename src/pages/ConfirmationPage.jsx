import { Link, useLocation } from "react-router-dom";
import { useFitFlow } from "../context/FitFlowContext";

export default function ConfirmationPage() {
  const location = useLocation();
  const { lastConfirmation } = useFitFlow();
  const confirmation = location.state?.confirmation || lastConfirmation;

  if (!confirmation) {
    return (
      <section className="section">
        <div className="container state-card">
          <span className="state-icon" aria-hidden="true">i</span>
          <h1>No recent confirmation was found.</h1>
          <p>Complete the class-booking journey to receive a confirmation summary.</p>
          <Link className="button primary" to="/classes">Browse fitness classes</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section confirmation-section">
      <div className="container confirmation-card">
        <div className="success-mark" aria-hidden="true">✓</div>
        <p className="eyebrow">Simulated booking confirmed</p>
        <h1>You’re ready to move, {confirmation.customer.fullName.split(" ")[0]}.</h1>
        <p className="confirmation-lead">
          A practice confirmation has been created for reference <strong>{confirmation.reference}</strong>.
        </p>

        <div className="confirmation-grid">
          <div>
            <h2>Your classes</h2>
            <ul className="confirmation-list">
              {confirmation.items.map((item) => (
                <li key={item.id}>
                  <div><strong>{item.name}</strong><span>{item.day}, {item.time}</span></div>
                  <span>{item.quantity} {item.quantity === 1 ? "place" : "places"}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="confirmation-summary">
            <h2>Summary</h2>
            <p><span>Attendee</span><strong>{confirmation.customer.fullName}</strong></p>
            <p><span>Total places</span><strong>{confirmation.totalPlaces}</strong></p>
            <p><span>Simulated total</span><strong>PKR {confirmation.subtotal.toLocaleString()}</strong></p>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link className="button primary large" to="/classes">Plan another week</Link>
          <Link className="button secondary large" to="/">Return home</Link>
        </div>
      </div>
    </section>
  );
}
