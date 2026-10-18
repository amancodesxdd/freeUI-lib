export default function FileTree({ files }) {
  const render = (nodes, depth = 0) =>
    nodes.map((node, i) => {
      const last = i === nodes.length - 1;
      const hasKids = node.children && node.children.length;
      return (
        <div key={`${node.name}-${i}`}>
          <div className="tree-row">
            <span className="tree-branch">{last ? "└──" : "├──"}</span>
            <span className="tree-name">{node.name}</span>
          </div>
          {hasKids && (
            <div className="tree-children">{render(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });

  return <div className="tree">{render(files)}</div>;
}