import { FiBarChart2 } from "react-icons/fi";

export function SummaryCard({ summary }) {
  const s = summary || {};
  return (
    <div className="card">
      <div className="cardTitle">
        <FiBarChart2 />
        Summary
      </div>

      <div className="kv">
        <div className="k">total_trees</div>
        <div className="v mono">{String(s.total_trees ?? 0)}</div>
        <div className="k">total_cycles</div>
        <div className="v mono">{String(s.total_cycles ?? 0)}</div>
        <div className="k">largest_tree_root</div>
        <div className="v mono">{String(s.largest_tree_root ?? "")}</div>
      </div>
    </div>
  );
}

