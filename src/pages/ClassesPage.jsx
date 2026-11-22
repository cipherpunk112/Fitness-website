import { useMemo, useState } from "react";
import ClassCard from "../components/ClassCard";
import DemoControls from "../components/DemoControls";
import StatusMessage from "../components/StatusMessage";
import { useFitFlow } from "../context/FitFlowContext";

function getStartTimestamp(item) {
  const [clockTime, period] = item.time.split(" ");
  const [rawHour, minute] = clockTime.split(":").map(Number);
  const hour = (rawHour % 12) + (period === "PM" ? 12 : 0);
  const paddedHour = String(hour).padStart(2, "0");

  return new Date(`${item.date}T${paddedHour}:${String(minute).padStart(2, "0")}:00`).getTime();
}

export default function ClassesPage() {
  const {
    classes,
    loading,
    error,
    notice,
    addToSelection,
    restoreSchedule,
  } = useFitFlow();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const categories = useMemo(
    () => ["All", ...new Set(classes.map((item) => item.category))],
    [classes],
  );

  const filteredClasses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return classes
      .filter((item) => {
        const searchableText = [
          item.name,
          item.coach,
          item.category,
          item.shortDescription,
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
          (category === "All" || item.category === category) &&
          (level === "All" || item.level === level) &&
          (availability === "all" || item.seatsLeft > 0)
        );
      })
      .sort((first, second) => {
        if (sortBy === "price-low") return first.price - second.price;
        if (sortBy === "price-high") return second.price - first.price;
        if (sortBy === "availability") return second.seatsLeft - first.seatsLeft;
        return getStartTimestamp(first) - getStartTimestamp(second);
      });
  }, [availability, category, classes, level, search, sortBy]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setLevel("All");
    setAvailability("all");
    setSortBy("date");
  }

  return (
    <section className="section catalogue-section">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Weekly class schedule</p>
          <h1>Choose a class that works for you.</h1>
          <p>
            Search and compare the important details. Your weekly plan stays saved while you browse.
          </p>
        </div>

        {notice && <StatusMessage>{notice}</StatusMessage>}

        <div className="filter-panel" aria-label="Class search and filters">
          <div className="field search-field">
            <label htmlFor="search">Search classes or coaches</label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try yoga, strength, or Ayesha"
            />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="level">Level</label>
            <select id="level" value={level} onChange={(event) => setLevel(event.target.value)}>
              <option>All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>All Levels</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="date">Soonest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="availability">Most places left</option>
            </select>
          </div>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={availability === "open"}
              onChange={(event) => setAvailability(event.target.checked ? "open" : "all")}
            />
            Show available classes only
          </label>
        </div>

        {loading && (
          <div className="state-card" role="status">
            <span className="loader" aria-hidden="true" />
            <h2>Loading the class schedule…</h2>
            <p>We are checking the latest local availability.</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-card error-state" role="alert">
            <span className="state-icon" aria-hidden="true">!</span>
            <h2>We could not load the schedule.</h2>
            <p>{error}</p>
            <button className="button primary" type="button" onClick={restoreSchedule}>
              Retry loading
            </button>
          </div>
        )}

        {!loading && !error && classes.length === 0 && (
          <div className="state-card">
            <h2>No classes have been published.</h2>
            <p>Try reloading the schedule, or return later when classes are available.</p>
            <button className="button secondary" type="button" onClick={restoreSchedule}>Reload schedule</button>
          </div>
        )}

        {!loading && !error && classes.length > 0 && filteredClasses.length === 0 && (
          <div className="state-card">
            <span className="state-icon" aria-hidden="true">⌕</span>
            <h2>No classes match those choices.</h2>
            <p>Try a different search, level, or category.</p>
            <button className="button secondary" type="button" onClick={clearFilters}>
              Clear search and filters
            </button>
          </div>
        )}

        {!loading && !error && filteredClasses.length > 0 && (
          <>
            <div className="results-line" aria-live="polite">
              <strong>{filteredClasses.length}</strong> of {classes.length} classes shown
            </div>
            <div className="class-grid">
              {filteredClasses.map((fitnessClass) => (
                <ClassCard
                  key={fitnessClass.id}
                  fitnessClass={fitnessClass}
                  onAdd={addToSelection}
                />
              ))}
            </div>
          </>
        )}

        <DemoControls />
      </div>
    </section>
  );
}
