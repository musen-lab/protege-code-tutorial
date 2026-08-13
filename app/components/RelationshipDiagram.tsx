"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { DiagramSpec, Tone } from "@/app/lib/course";
import { sourceUrl } from "@/app/lib/course";

// What each node color means, in a stable display order. Every diagram shows
// a legend for exactly the tones it uses.
const TONE_LABELS: Record<Tone, string> = {
  runtime: "Runtime & packaging",
  core: "Framework (editor-core)",
  owl: "OWL editor (editor-owl)",
  ui: "User-visible UI",
  data: "Model & data state",
};
const TONE_ORDER: Tone[] = ["runtime", "core", "owl", "ui", "data"];

export function RelationshipDiagram({ diagram }: { diagram: DiagramSpec }) {
  const [selected, setSelected] = useState(0);
  const node = diagram.nodes[selected];
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const connections = useMemo(() => diagram.connections ?? diagram.nodes.slice(0, -1).map((item, index) => ({
    from: item.title,
    to: diagram.nodes[index + 1].title,
    label: diagram.edges[index] ?? "then",
  })), [diagram]);
  const columns = diagram.columns ?? (diagram.nodes.length <= 4 ? diagram.nodes.length : diagram.nodes.length <= 6 ? 3 : 4);

  // A same-row connection with another node between its endpoints cannot be a
  // straight line: the line would run underneath the intervening box and its
  // label would float in an unrelated gap. Those connections are routed as an
  // arc through the lane below their row instead.
  const layout = useMemo(() => {
    const positions = new Map<string, { column: number; row: number }>();
    diagram.nodes.forEach((item, index) => {
      positions.set(item.title, item.position ?? {
        column: (index % columns) + 1,
        row: Math.floor(index / columns) + 1,
      });
    });
    const maxRow = Math.max(...[...positions.values()].map((position) => position.row));
    const arcsPerRow = new Map<number, number>();
    const arcs = new Map<string, { depth: number; row: number }>();
    connections.forEach((connection) => {
      const from = positions.get(connection.from);
      const to = positions.get(connection.to);
      if (!from || !to || from.row !== to.row || Math.abs(from.column - to.column) < 2) {
        return;
      }
      const low = Math.min(from.column, to.column);
      const high = Math.max(from.column, to.column);
      const blocked = [...positions.values()].some(
        (position) => position.row === from.row && position.column > low && position.column < high,
      );
      if (!blocked) {
        return;
      }
      const laneIndex = arcsPerRow.get(from.row) ?? 0;
      arcsPerRow.set(from.row, laneIndex + 1);
      arcs.set(`${connection.from}→${connection.to}`, { depth: 30 + laneIndex * 18, row: from.row });
    });
    const bottomLaneDepth = [...arcs.values()]
      .filter((arc) => arc.row === maxRow)
      .reduce((deepest, arc) => Math.max(deepest, arc.depth), 0);
    return { arcs, extraBottom: bottomLaneDepth ? Math.max(0, bottomLaneDepth - 4) : 0 };
  }, [connections, diagram, columns]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) {
      return;
    }

    const draw = () => {
      const stageRect = stage.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(stageRect.width * ratio));
      canvas.height = Math.max(1, Math.round(stageRect.height * ratio));
      canvas.style.width = `${stageRect.width}px`;
      canvas.style.height = `${stageRect.height}px`;

      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.scale(ratio, ratio);
      context.clearRect(0, 0, stageRect.width, stageRect.height);

      const styles = getComputedStyle(stage);
      const lineColor = styles.getPropertyValue("--diagram-line").trim() || "#716879";
      const labelBackground = styles.getPropertyValue("--diagram-label-bg").trim() || "#fffdf8";
      const labelColor = styles.getPropertyValue("--diagram-label-ink").trim() || "#514957";

      const rects = new Map<string, DOMRect>();
      stage.querySelectorAll<HTMLElement>("[data-diagram-node]").forEach((element) => {
        rects.set(element.dataset.diagramNode ?? "", element.getBoundingClientRect());
      });

      const geometries = connections.flatMap((connection) => {
        const fromRect = rects.get(connection.from);
        const toRect = rects.get(connection.to);
        if (!fromRect || !toRect) {
          return [];
        }

        const from = relativeRect(fromRect, stageRect);
        const to = relativeRect(toRect, stageRect);
        const arc = layout.arcs.get(`${connection.from}→${connection.to}`);
        if (arc) {
          const start = { x: from.x + from.width / 2, y: from.y + from.height };
          const end = { x: to.x + to.width / 2, y: to.y + to.height };
          const rowBottom = Math.max(start.y, end.y);
          const control = { x: start.x + (end.x - start.x) / 2, y: rowBottom + arc.depth * 2 };
          return [{ connection, from, to, start, end, control, sameRow: false, sameColumn: false }];
        }
        const start = edgePoint(from, to);
        const end = edgePoint(to, from);
        const sameRow = Math.abs(start.y - end.y) < 12;
        const sameColumn = Math.abs(start.x - end.x) < 12;
        return [{ connection, from, to, start, end, control: undefined, sameRow, sameColumn }];
      });

      // Paint every path first. Labels are a separate pass so no later path can
      // cross through text that has already been drawn.
      geometries.forEach(({ start, end, control, sameRow, sameColumn }) => {
        context.save();
        context.strokeStyle = lineColor;
        context.fillStyle = lineColor;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(start.x, start.y);
        if (control) {
          context.quadraticCurveTo(control.x, control.y, end.x, end.y);
        } else if (sameRow || sameColumn) {
          context.lineTo(end.x, end.y);
        } else {
          const middleY = start.y + (end.y - start.y) / 2;
          context.bezierCurveTo(start.x, middleY, end.x, middleY, end.x, end.y);
        }
        context.stroke();

        const angle = control
          ? Math.atan2(end.y - control.y, end.x - control.x)
          : sameRow || sameColumn
            ? Math.atan2(end.y - start.y, end.x - start.x)
            : Math.atan2(end.y - (start.y + end.y) / 2, 0.01);
        drawArrowHead(context, end.x, end.y, angle);
        context.restore();
      });

      // Labels avoid boxes and one another: a label drawn under a node button
      // is invisible, and overlapping labels are unreadable.
      const nodeObstacles = [...rects.values()].map((rect) => relativeRect(rect, stageRect));
      const placedLabels: Rect[] = [];
      const overlaps = (candidate: Rect) =>
        [...nodeObstacles, ...placedLabels].some(
          (other) =>
            candidate.x < other.x + other.width + 2 &&
            candidate.x + candidate.width > other.x - 2 &&
            candidate.y < other.y + other.height + 2 &&
            candidate.y + candidate.height > other.y - 2,
        );

      geometries.forEach(({ connection, from, to, start, end, control, sameRow }) => {
        const labelX = start.x + (end.x - start.x) / 2;
        let labelY = start.y + (end.y - start.y) / 2;
        context.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        const textWidth = context.measureText(connection.label).width;

        if (control) {
          // The apex of the quadratic arc, where the lane is open.
          labelY = 0.25 * start.y + 0.5 * control.y + 0.25 * end.y;
        } else {
          // A long label cannot fit between two boxes on the same row. Put it
          // in the open row corridor instead of allowing either box to clip it.
          const horizontalGap = Math.abs(end.x - start.x);
          if (sameRow && textWidth + 12 > horizontalGap - 4) {
            labelY = Math.max(10, Math.min(from.y, to.y) - 15);
          }
        }

        const labelRect = (y: number): Rect => ({
          x: labelX - textWidth / 2 - 6,
          y: y - 10,
          width: textWidth + 12,
          height: 20,
        });
        // A nudged label must stay inside the canvas: a candidate that clears
        // its neighbors by leaving the stage is worse than a slight overlap.
        const inStage = (rect: Rect) => rect.y >= 0 && rect.y + rect.height <= stageRect.height;
        for (const offset of [0, -16, 16, -30, 30]) {
          const candidate = labelRect(labelY + offset);
          if (inStage(candidate) && !overlaps(candidate)) {
            labelY += offset;
            break;
          }
        }
        placedLabels.push(labelRect(labelY));

        context.save();
        context.fillStyle = labelBackground;
        roundedRect(context, labelX - textWidth / 2 - 6, labelY - 10, textWidth + 12, 20, 5);
        context.fill();
        context.fillStyle = labelColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(connection.label, labelX, labelY);
        context.restore();
      });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(stage);
    window.addEventListener("resize", draw);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, [connections, layout]);

  return (
    <figure className="relationship-diagram" aria-labelledby={`diagram-${slugify(diagram.title)}`}>
      <div className="diagram-heading">
        <div>
          <p><span>{diagram.kind ?? "Flow diagram"}</span>{diagram.question}</p>
          <h3 id={`diagram-${slugify(diagram.title)}`}>{diagram.title}</h3>
        </div>
        <span>Select any box for detail</span>
      </div>
      <div
        className="diagram-graph"
        ref={stageRef}
        style={{
          "--diagram-columns": columns,
          "--diagram-arc-lane": `${layout.extraBottom}px`,
        } as CSSProperties}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="diagram-node-grid" role="list" aria-label={`${diagram.title} nodes`}>
          {diagram.nodes.map((item, index) => (
            <div
              role="listitem"
              key={`${item.title}-${index}`}
              style={item.position ? { gridColumn: item.position.column, gridRow: item.position.row } : undefined}
            >
              <button
                type="button"
                data-diagram-node={item.title}
                className={`diagram-node tone-${item.tone} ${selected === index ? "is-selected" : ""}`}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <small>{item.subtitle}</small>
                <strong className={codeTitleClass(item.title)}>{item.title}</strong>
              </button>
            </div>
          ))}
        </div>
        <ul className="diagram-mobile-relations" aria-label={`${diagram.title} relationships`}>
          {connections.map((connection) => (
            <li key={`${connection.from}-${connection.label}-${connection.to}`}>
              <strong>{connection.from}</strong>
              <span>{connection.label} <b aria-hidden="true">→</b></span>
              <strong>{connection.to}</strong>
            </li>
          ))}
        </ul>
      </div>
      <ul className="diagram-legend" aria-label="What the box colors mean">
        {TONE_ORDER.filter((tone) => diagram.nodes.some((item) => item.tone === tone)).map((tone) => (
          <li key={tone}>
            <span className={`legend-swatch tone-${tone}`} aria-hidden="true" />
            {TONE_LABELS[tone]}
          </li>
        ))}
      </ul>
      <div className="diagram-detail" aria-live="polite">
        <div className={`detail-key tone-${node.tone}`} aria-hidden="true">{selected + 1}</div>
        <div>
          <strong>{node.title}</strong>
          <p>{node.detail}</p>
          {node.source && (
            <a href={sourceUrl(node.source.path, node.source.line)} target="_blank" rel="noreferrer">
              Open {node.source.label} at the verified snapshot ↗
            </a>
          )}
        </div>
      </div>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function codeTitleClass(value: string) {
  if (!/^[a-zA-Z0-9_.:$-]+$/.test(value)) {
    return undefined;
  }
  return value.length > 17 ? "diagram-code-title is-long" : "diagram-code-title";
}

type Rect = { x: number; y: number; width: number; height: number };

function relativeRect(rect: DOMRect, parent: DOMRect): Rect {
  return { x: rect.x - parent.x, y: rect.y - parent.y, width: rect.width, height: rect.height };
}

function edgePoint(from: Rect, to: Rect) {
  const fromCenter = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const toCenter = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  const scaleX = dx === 0 ? Number.POSITIVE_INFINITY : (from.width / 2) / Math.abs(dx);
  const scaleY = dy === 0 ? Number.POSITIVE_INFINITY : (from.height / 2) / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);
  return { x: fromCenter.x + dx * scale, y: fromCenter.y + dy * scale };
}

function drawArrowHead(context: CanvasRenderingContext2D, x: number, y: number, angle: number) {
  const size = 8;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x - size * Math.cos(angle - Math.PI / 6), y - size * Math.sin(angle - Math.PI / 6));
  context.lineTo(x - size * Math.cos(angle + Math.PI / 6), y - size * Math.sin(angle + Math.PI / 6));
  context.closePath();
  context.fill();
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}
