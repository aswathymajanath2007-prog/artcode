export default function Loading() {
  return (
    <main className="loka-loading" role="status" aria-live="polite">
      <div className="loka-loading-card">
        <div className="loka-loading-mark" aria-hidden="true">
          <span>✿</span>
        </div>
        <p className="loka-loading-kicker">A JOURNEY THROUGH INDIA</p>
        <h1>LOKA</h1>
        <p className="loka-loading-copy">Discovering stories, places and traditions.</p>
        <div className="loka-loading-track" aria-hidden="true">
          <span />
        </div>
        <span className="loka-loading-note">ONE LAND. MANY STORIES.</span>
      </div>
    </main>
  );
}
