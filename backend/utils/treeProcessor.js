const EDGE_PATTERN = /^([A-Z])\s*->\s*([A-Z])$/;

function normalizeEdgeString(raw) {
  if (typeof raw !== "string") return { ok: false, raw, trimmed: "" };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, raw, trimmed };
  return { ok: true, raw, trimmed };
}

function parseEdge(trimmed) {
  const m = EDGE_PATTERN.exec(trimmed);
  if (!m) return null;
  const from = m[1];
  const to = m[2];
  if (from === to) return null;
  return { from, to, edge: `${from}->${to}` };
}

function addToSetMap(setMap, key, value) {
  let s = setMap.get(key);
  if (!s) {
    s = new Set();
    setMap.set(key, s);
  }
  s.add(value);
}

function getOrInitArrayMap(arrMap, key) {
  let a = arrMap.get(key);
  if (!a) {
    a = [];
    arrMap.set(key, a);
  }
  return a;
}

function buildTreeObject(root, childrenByParent) {
  const build = (node) => {
    const kids = childrenByParent.get(node);
    if (!kids || kids.length === 0) return {};
    const obj = {};
    for (const c of kids) obj[c] = build(c);
    return obj;
  };
  const tree = {};
  tree[root] = build(root);
  return tree;
}

function computeDepth(root, childrenByParent) {
  const memo = new Map();
  const dfs = (node) => {
    if (memo.has(node)) return memo.get(node);
    const kids = childrenByParent.get(node);
    if (!kids || kids.length === 0) {
      memo.set(node, 1);
      return 1;
    }
    let best = 0;
    for (const c of kids) best = Math.max(best, dfs(c));
    const d = 1 + best;
    memo.set(node, d);
    return d;
  };
  return dfs(root);
}

function detectCycleInComponent(nodes, childrenByParent) {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map();
  for (const n of nodes) color.set(n, WHITE);

  const stack = [];
  const iters = new Map();

  for (const start of nodes) {
    if (color.get(start) !== WHITE) continue;
    stack.push(start);
    iters.set(start, 0);

    while (stack.length) {
      const node = stack[stack.length - 1];
      if (color.get(node) === WHITE) color.set(node, GRAY);

      const kids = childrenByParent.get(node) || [];
      let i = iters.get(node) || 0;
      if (i >= kids.length) {
        color.set(node, BLACK);
        stack.pop();
        continue;
      }
      const nxt = kids[i];
      iters.set(node, i + 1);
      const c = color.get(nxt);
      if (c === GRAY) return true;
      if (c === WHITE) {
        stack.push(nxt);
        iters.set(nxt, 0);
      }
    }
  }
  return false;
}

function getRootsForNodes(nodes, hasParent) {
  const roots = [];
  for (const n of nodes) if (!hasParent.has(n)) roots.push(n);
  roots.sort();
  return roots;
}

function getLexicographicallySmallest(nodes) {
  let best = null;
  for (const n of nodes) {
    if (best === null || n < best) best = n;
  }
  return best;
}

function buildUndirectedAdjacency(nodes, childrenByParent, parentOf) {
  const undirected = new Map();
  for (const n of nodes) undirected.set(n, []);
  for (const [p, kids] of childrenByParent.entries()) {
    for (const c of kids) {
      if (!undirected.has(p)) undirected.set(p, []);
      if (!undirected.has(c)) undirected.set(c, []);
      undirected.get(p).push(c);
      undirected.get(c).push(p);
    }
  }
  // parentOf edges are already included above, but keep function future-proof.
  if (parentOf) parentOf.size;
  return undirected;
}

function getConnectedComponents(nodes, undirectedAdj) {
  const seen = new Set();
  const components = [];
  for (const n of nodes) {
    if (seen.has(n)) continue;
    const q = [n];
    seen.add(n);
    const comp = [];
    while (q.length) {
      const cur = q.pop();
      comp.push(cur);
      const neigh = undirectedAdj.get(cur) || [];
      for (const v of neigh) {
        if (!seen.has(v)) {
          seen.add(v);
          q.push(v);
        }
      }
    }
    components.push(comp);
  }
  return components;
}

function analyzeEdgeList(data) {
  const invalid_entries = [];
  const duplicate_edges = [];

  const seenEdge = new Set();
  const duplicateEdgeSeen = new Set();

  const parentOf = new Map(); // child -> parent (first parent only)
  const childrenByParent = new Map(); // parent -> children[] (in arrival order)
  const nodes = new Set();
  const hasParent = new Set(); // nodes that appear as child (after first-parent rule)

  for (const raw of data) {
    const norm = normalizeEdgeString(raw);
    if (!norm.ok) {
      invalid_entries.push(typeof raw === "string" ? raw : String(raw));
      continue;
    }

    const parsed = parseEdge(norm.trimmed);
    if (!parsed) {
      invalid_entries.push(norm.trimmed);
      continue;
    }

    if (seenEdge.has(parsed.edge)) {
      if (!duplicateEdgeSeen.has(parsed.edge)) {
        duplicate_edges.push(parsed.edge);
        duplicateEdgeSeen.add(parsed.edge);
      }
      continue;
    }
    seenEdge.add(parsed.edge);

    // multi-parent rule: if child already has a parent, ignore silently
    if (parentOf.has(parsed.to)) continue;

    parentOf.set(parsed.to, parsed.from);
    hasParent.add(parsed.to);
    nodes.add(parsed.from);
    nodes.add(parsed.to);

    const arr = getOrInitArrayMap(childrenByParent, parsed.from);
    arr.push(parsed.to);
  }

  // Ensure all nodes appear in map for consistent traversals
  for (const n of nodes) {
    if (!childrenByParent.has(n)) childrenByParent.set(n, []);
  }

  const undirected = buildUndirectedAdjacency(nodes, childrenByParent, parentOf);
  const components = getConnectedComponents(nodes, undirected);

  const hierarchies = [];
  let total_cycles = 0;

  const nonCyclicDepthByRoot = new Map();
  const allRoots = [];

  for (const compNodesArr of components) {
    const compNodes = new Set(compNodesArr);
    const roots = getRootsForNodes(compNodes, hasParent);

    const compHasCycle = detectCycleInComponent(compNodes, childrenByParent);
    if (compHasCycle) {
      total_cycles += 1;
      const root = roots.length ? roots[0] : getLexicographicallySmallest(compNodes);
      hierarchies.push({ root, tree: {}, has_cycle: true });
      allRoots.push(root);
      continue;
    }

    // Non-cyclic component can still have multiple roots => multiple trees
    const useRoots = roots.length ? roots : [getLexicographicallySmallest(compNodes)];
    for (const root of useRoots) {
      const depth = computeDepth(root, childrenByParent);
      const tree = buildTreeObject(root, childrenByParent)[root];
      hierarchies.push({ root, tree, depth });
      nonCyclicDepthByRoot.set(root, depth);
      allRoots.push(root);
    }
  }

  let largest_tree_root = null;
  let bestDepth = -1;
  for (const [root, depth] of nonCyclicDepthByRoot.entries()) {
    if (depth > bestDepth || (depth === bestDepth && root < largest_tree_root)) {
      bestDepth = depth;
      largest_tree_root = root;
    }
  }
  if (largest_tree_root === null) {
    // If everything is cyclic (no depth), pick lexicographically smallest root overall.
    allRoots.sort();
    largest_tree_root = allRoots[0] || null;
  }

  const summary = {
    total_trees: hierarchies.length,
    total_cycles,
    largest_tree_root,
  };

  return { hierarchies, invalid_entries, duplicate_edges, summary };
}

module.exports = { analyzeEdgeList };

