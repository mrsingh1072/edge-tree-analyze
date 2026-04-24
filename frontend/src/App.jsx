import { useMemo, useState } from "react";
import { FiCopy, FiTrash2, FiZap, FiAlertTriangle } from "react-icons/fi";
import "./App.css";
import { postBfhl } from "./services/api";
import { InputForm } from "./components/InputForm";
import { TreeCard } from "./components/TreeCard";
import { SummaryCard } from "./components/SummaryCard";

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (kind, message) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setToasts((t) => [...t, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  };
  return { toasts, push };
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

function App() {
  const [input, setInput] = useState("A->B,A->C,B->D");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [result, setResult] = useState(null);
  const { toasts, push } = useToasts();

  const edges = useMemo(
    () => input.split(",").map((s) => s.trim()),
    [input],
  );

  const onClear = () => {
    setInput("");
    setResult(null);
    setApiError("");
    push("info", "Cleared input.");
  };

  const onSample = () => {
    setInput("A->B, A->C, B->D, B->E, C->F");
    push("success", "Sample data loaded.");
  };

  const onSubmit = async () => {
    setLoading(true);
    setApiError("");
    setResult(null);
    try {
      const res = await postBfhl({ data: edges });
      setResult(res);
      push("success", "Analysis complete.");
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Failed to reach the API. Is the backend running on port 5000?";
      setApiError(msg);
      push("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const onCopyJson = async () => {
    if (!result) return;
    try {
      await copyText(JSON.stringify(result, null, 2));
      push("success", "JSON copied to clipboard.");
    } catch {
      push("error", "Copy failed (clipboard permission).");
    }
  };

  return (
    <div className="page">
      <div className="bgGlow" aria-hidden="true" />

      <header className="header">
        <div className="brand">
          <div className="brandMark" aria-hidden="true">
            <FiZap />
          </div>
          <div>
            <div className="title">EdgeTree Analyzer</div>
            <div className="subtitle">
              Paste edges, validate, dedupe, build hierarchies, detect cycles.
            </div>
          </div>
        </div>

        <div className="headerActions">
          <button className="btn btnGhost" type="button" onClick={onSample}>
            <FiZap /> Sample
          </button>
          <button className="btn btnGhost" type="button" onClick={onClear}>
            <FiTrash2 /> Clear
          </button>
          <button
            className="btn btnPrimary"
            type="button"
            onClick={onCopyJson}
            disabled={!result}
            title={result ? "Copy response JSON" : "Run analysis first"}
          >
            <FiCopy /> Copy JSON
          </button>
        </div>
      </header>

      <main className="main">
        <InputForm
          value={input}
          onChange={setInput}
          onSubmit={onSubmit}
          loading={loading}
        />

        {apiError ? (
          <div className="card cardError" role="alert">
            <div className="cardTitle">
              <FiAlertTriangle />
              API Error
            </div>
            <div className="mono">{apiError}</div>
          </div>
        ) : null}

        {loading ? (
          <div className="card cardLoading" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <div>
              <div className="cardTitle">Processing…</div>
              <div className="muted">
                Building trees, resolving duplicates, detecting cycles.
              </div>
            </div>
          </div>
        ) : null}

        {result ? (
          <>
            <div className="grid">
              <SummaryCard summary={result.summary} />

              <div className="card">
                <div className="cardTitle">Identity</div>
                <div className="kv">
                  <div className="k">user_id</div>
                  <div className="v mono">{result.user_id}</div>
                  <div className="k">email_id</div>
                  <div className="v mono">{result.email_id}</div>
                  <div className="k">college_roll_number</div>
                  <div className="v mono">{result.college_roll_number}</div>
                </div>
              </div>
            </div>

            <section className="section">
              <div className="sectionTitle">
                Hierarchies ({result.hierarchies?.length || 0})
              </div>
              <div className="cards">
                {(result.hierarchies || []).map((h, idx) => (
                  <TreeCard key={`${h.root}_${idx}`} hierarchy={h} />
                ))}
              </div>
            </section>

            <section className="section">
              <div className="grid">
                <div className="card">
                  <div className="cardTitle">
                    Invalid entries ({result.invalid_entries?.length || 0})
                  </div>
                  {result.invalid_entries?.length ? (
                    <div className="pillWrap">
                      {result.invalid_entries.map((x, i) => (
                        <span key={`${x}_${i}`} className="pill pillWarn mono">
                          {String(x)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="muted">None</div>
                  )}
                </div>

                <div className="card">
                  <div className="cardTitle">
                    Duplicate edges ({result.duplicate_edges?.length || 0})
                  </div>
                  {result.duplicate_edges?.length ? (
                    <div className="pillWrap">
                      {result.duplicate_edges.map((x) => (
                        <span key={x} className="pill pillInfo mono">
                          {x}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="muted">None</div>
                  )}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="sectionTitle">Raw response</div>
              <div className="card">
                <pre className="pre">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </section>
          </>
        ) : (
          <div className="hint">
            Tip: enter edges like <span className="pill pillInfo mono">A-&gt;B</span>{" "}
            separated by commas. Spaces are okay.
          </div>
        )}
      </main>

      <div className="toastHost" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast_${t.kind}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
