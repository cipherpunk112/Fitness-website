import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Fitness that fits student life</p>
            <h1>Find your class. Build your week. Move better.</h1>
            <p className="hero-lead">
              Compare coached fitness sessions with the price, level, time, and current demo availability shown before you choose.
            </p>
            <div className="hero-actions">
              <Link className="button primary large" to="/classes">
                Browse classes
              </Link>
              <a className="button secondary large" href="#how-it-works">
                How it works
              </a>
            </div>
            <ul className="trust-list" aria-label="FitFlow highlights">
              <li>Small coached groups</li>
              <li>From PKR 750</li>
              <li>H-13 Islamabad</li>
            </ul>
          </div>

          <div className="hero-board" aria-label="Sample weekly schedule">
            <div className="board-heading">
              <span>Sample week</span>
              <strong>Move your way</strong>
            </div>
            <div className="mini-class lime">
              <span>MON · 7:00 AM</span>
              <strong>Sunrise Yoga</strong>
              <small>Beginner · 8 places</small>
            </div>
            <div className="mini-class white">
              <span>WED · 7:30 PM</span>
              <strong>Boxing Basics</strong>
              <small>Beginner · 4 places</small>
            </div>
            <div className="mini-class mint">
              <span>SAT · 9:00 AM</span>
              <strong>Pilates Reset</strong>
              <small>Beginner · 6 places</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">A clearer booking journey</p>
              <h2>Everything important appears before checkout.</h2>
            </div>
            <p>
              FitFlow is designed for people choosing between classes around lectures, work, budget, and experience level.
            </p>
          </div>
          <div className="steps-grid">
            <article>
              <span>01</span>
              <h3>Discover</h3>
              <p>Search by class or coach, then filter by category, level, and availability.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Compare</h3>
              <p>See timing, price, coach, difficulty, and places left without opening every page.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Plan</h3>
              <p>Keep selections while browsing, correct quantities, and review the full cost.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section rules-section">
        <div className="container rules-grid">
          <div>
            <p className="eyebrow">Know before you book</p>
            <h2>Simple rules, stated early.</h2>
          </div>
          <ul className="rule-list">
            <li>
              <strong>Up to 4 places</strong>
              <span>per class, subject to current demo availability</span>
            </li>
            <li>
              <strong>Age 16+</strong>
              <span>for all FitFlow group sessions</span>
            </li>
            <li>
              <strong>PKR 2,000 minimum</strong>
              <span>for a simulated online booking</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
