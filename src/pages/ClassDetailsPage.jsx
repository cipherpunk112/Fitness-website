import { Link, useParams } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";
import { useFitFlow } from "../context/FitFlowContext";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const { classes, loading, error, notice, addToSelection, restoreSchedule } = useFitFlow();
  const fitnessClass = classes.find((item) => item.id === id);

  if (loading) {
    return (
      <section className="section">
        <div className="container state-card" role="status">
          <span className="loader" aria-hidden="true" />
          <h1>Loading class details…</h1>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container state-card error-state" role="alert">
          <h1>Class details are temporarily unavailable.</h1>
          <p>{error}</p>
          <button className="button primary" type="button" onClick={restoreSchedule}>Retry loading</button>
        </div>
      </section>
    );
  }

  if (!fitnessClass) {
    return (
      <section className="section">
        <div className="container state-card">
          <span className="state-icon" aria-hidden="true">?</span>
          <h1>That class could not be found.</h1>
          <p>The link may be incorrect, or the class may no longer be part of this schedule.</p>
          <Link className="button primary" to="/classes">Browse available classes</Link>
        </div>
      </section>
    );
  }

  const isFull = fitnessClass.seatsLeft === 0;

  return (
    <section className="section details-section">
      <div className="container">
        <Link className="back-link" to="/classes">← Back to all classes</Link>
        {notice && <StatusMessage>{notice}</StatusMessage>}

        <div className="details-grid">
          <div className="details-visual">
            <span aria-hidden="true">{fitnessClass.icon}</span>
            <small>{fitnessClass.category}</small>
          </div>

          <div className="details-content">
            <div className="card-topline">
              <span className="level-pill">{fitnessClass.level}</span>
              <span className={isFull ? "availability full" : "availability"}>
                {isFull ? "Full – cannot be selected" : `${fitnessClass.seatsLeft} places left`}
              </span>
            </div>
            <h1>{fitnessClass.name}</h1>
            <p className="details-lead">{fitnessClass.description}</p>

            <dl className="details-facts">
              <div><dt>Date and time</dt><dd>{fitnessClass.day}, {fitnessClass.date} at {fitnessClass.time}</dd></div>
              <div><dt>Duration</dt><dd>{fitnessClass.duration} minutes</dd></div>
              <div><dt>Coach</dt><dd>{fitnessClass.coach}</dd></div>
              <div><dt>Location</dt><dd>{fitnessClass.location}</dd></div>
              <div><dt>Price per place</dt><dd>PKR {fitnessClass.price.toLocaleString()}</dd></div>
              <div><dt>Availability</dt><dd>{isFull ? "No places available" : `${fitnessClass.seatsLeft} places currently available`}</dd></div>
            </dl>

            <div className="info-boxes">
              <article><h2>Who it suits</h2><p>{fitnessClass.suitability}</p></article>
              <article><h2>What to bring</h2><p>{fitnessClass.equipment}</p></article>
            </div>

            <div className="rule-reminder">
              <strong>Booking rules</strong>
              <span>Age 16+ · maximum 4 places per class · PKR 2,000 minimum total</span>
            </div>

            <div className="details-actions">
              <button
                className="button primary large"
                type="button"
                onClick={() => addToSelection(fitnessClass.id)}
                disabled={isFull}
              >
                {isFull ? "Class is full" : "Add one place to plan"}
              </button>
              <Link className="button secondary large" to="/booking">Review my plan</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
