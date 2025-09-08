import React, { useState } from "react";

/**
 * ProductStatusFlow.jsx (React + JavaScript + Tailwind)
 *
 * Drop-in component to visualize a product lifecycle for your PLM app.
 *
 * Features
 * - Data‑driven steps (id, title, description)
 * - Horizontal flow with connecting arrows
 * - Click a step to set it as the current status
 * - Shows progress color up to current status
 * - Responsive: wraps to multiple rows on small screens; scroll-x helper for tiny screens
 * - Pure React + Tailwind (no extra deps)
 *
 * Usage
 *   <ProductStatusFlow
 *     steps={defaultSteps}
 *     initialStatus="concept"
 *     onStatusChange={(id) => console.log("new status:", id)}
 *   />
 */

const defaultSteps = [
  {
    id: "concept",
    title: "Concept",
    description: "Ideation, requirements & feasibility",
  },
  {
    id: "design",
    title: "Design",
    description: "Sketches, silhouettes, materials",
  },
  {
    id: "development",
    title: "Development",
    description: "Tech pack, BOM, specs",
  },
  {
    id: "prototype",
    title: "Prototype",
    description: "Sample creation & internal review",
  },
  {
    id: "sampling",
    title: "Pre‑Prod Sample",
    description: "Fit/comfort tests & approvals",
  },
  {
    id: "production",
    title: "Production",
    description: "Manufacturing & assembly",
  },
  { id: "quality", title: "Quality", description: "QA checks & compliance" },
  { id: "shipment", title: "Shipment", description: "Logistics & delivery" },
];

export default function ProductStatusFlow({
  steps = defaultSteps,
  initialStatus = steps[0]?.id,
  onStatusChange,
}) {
  const [current, setCurrent] = useState(initialStatus);

  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === current)
  );

  const handleClick = (id) => {
    setCurrent(id);
    onStatusChange && onStatusChange(id);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Product Status Flow
          </h2>
          <p className="text-sm text-muted-foreground">
            Click a step to set the current status.
          </p>
        </div>
        <div className="text-sm">
          <span className="mr-2 inline-flex h-3 w-3 rounded-full bg-primary/80 align-middle" />
          <span className="align-middle text-muted-foreground">
            Completed / Current
          </span>
        </div>
      </div>

      {/* Flow container */}
      <div className="relative overflow-x-auto">
        <div className="grid auto-cols-fr grid-flow-col gap-4 md:gap-6 min-w-max">
          {steps.map((step, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isActive = isDone || isCurrent;

            return (
              <div key={step.id} className="flex items-stretch">
                {/* Node */}
                <button
                  type="button"
                  onClick={() => handleClick(step.id)}
                  className={[
                    "group relative flex w-64 min-w-64 flex-col justify-between rounded-2xl border p-4 text-left shadow-sm transition",
                    isCurrent
                      ? "border-primary/40 bg-primary/5 ring-2 ring-primary/30"
                      : isActive
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card",
                  ].join(" ")}
                >
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <h3
                      className={[
                        "text-lg font-semibold",
                        isActive ? "text-foreground" : "text-foreground/80",
                      ].join(" ")}
                    >
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {/* Status pill */}
                  <div className="mt-3">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {isCurrent
                        ? "Current"
                        : isActive
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </div>

                  {/* Progress bar (bottom) */}
                  <div className="mt-4 h-1 w-full rounded-full bg-muted">
                    <div
                      className={[
                        "h-1 rounded-full transition-all",
                        isActive ? "bg-primary" : "bg-muted-foreground/20",
                      ].join(" ")}
                      style={{ width: isActive ? "100%" : "0%" }}
                    />
                  </div>
                </button>

                {/* Arrow (except last) */}
                {idx < steps.length - 1 && (
                  <div className="flex w-8 items-center justify-center md:w-10">
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0"
                    >
                      <path
                        d="M3 12h16m-4-4 4 4-4 4"
                        className={[
                          "stroke-current",
                          idx < currentIndex ? "opacity-100" : "opacity-40",
                        ].join(" ")}
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer actions / example integration */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Current status:</span>
        <code className="rounded-md bg-muted px-2 py-1 text-sm">{current}</code>
        <div className="ml-auto" />
        {/* Example buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleClick(prevId(steps, current))}
            className="rounded-xl border bg-card px-3 py-1.5 text-sm shadow-sm hover:bg-accent"
          >
            ◀︎ Previous
          </button>
          <button
            type="button"
            onClick={() => handleClick(nextId(steps, current))}
            className="rounded-xl border bg-card px-3 py-1.5 text-sm shadow-sm hover:bg-accent"
          >
            Next ▶︎
          </button>
        </div>
      </div>
    </div>
  );
}

function prevId(steps, currentId) {
  const i = steps.findIndex((s) => s.id === currentId);
  if (i <= 0) return steps[0]?.id;
  return steps[i - 1]?.id;
}

function nextId(steps, currentId) {
  const i = steps.findIndex((s) => s.id === currentId);
  if (i === -1) return steps[0]?.id;
  if (i >= steps.length - 1) return steps[steps.length - 1]?.id;
  return steps[i + 1]?.id;
}

// Optional: export defaults for quick import elsewhere
export { defaultSteps };
