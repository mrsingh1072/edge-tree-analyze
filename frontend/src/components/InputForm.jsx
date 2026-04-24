import { FiSend } from "react-icons/fi";

export function InputForm({ value, onChange, onSubmit, loading }) {
  return (
    <section className="card">
      <div className="cardTitle">Input</div>
      <div className="muted">
        Enter node list comma separated. Example:{" "}
        <span className="pill pillInfo mono">A-&gt;B,A-&gt;C,B-&gt;D</span>
      </div>

      <label className="field">
        <span className="srOnly">Edge list</span>
        <textarea
          className="textarea mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="A->B,A->C,B->D"
          rows={4}
        />
      </label>

      <div className="row">
        <button
          className="btn btnPrimary"
          type="button"
          onClick={onSubmit}
          disabled={loading}
        >
          <FiSend />
          {loading ? "Submitting…" : "Analyze"}
        </button>
        <div className="muted">
          Calls <span className="mono">http://localhost:5000/bfhl</span>
        </div>
      </div>
    </section>
  );
}

