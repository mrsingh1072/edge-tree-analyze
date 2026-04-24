import { FiGitBranch, FiAlertOctagon } from "react-icons/fi";

export function TreeCard({ hierarchy }) {
  const isCycle = Boolean(hierarchy?.has_cycle);
  const root = hierarchy?.root ?? "?";
  const depth = hierarchy?.depth;
  const tree = hierarchy?.tree ?? {};

  return (
    <article className="card cardHover">
      <div className="treeHead">
        <div className="treeTitle">
          <FiGitBranch />
          Root <span className="mono">{root}</span>
        </div>
        <div className="badges">
          {isCycle ? (
            <span className="badge badgeDanger">
              <FiAlertOctagon /> Cycle
            </span>
          ) : (
            <span className="badge badgeOk">Depth: {depth}</span>
          )}
        </div>
      </div>

      <div className="divider" />
      <pre className="pre">{JSON.stringify(tree, null, 2)}</pre>
    </article>
  );
}

