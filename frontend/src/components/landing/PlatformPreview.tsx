"use client";

import { motion } from "framer-motion";
import { Monitor, Map, LineChart, LayoutDashboard } from "lucide-react";

const previews = [
  {
    icon: LayoutDashboard,
    title: "Analytics Dashboard",
    description: "Comprehensive constituency metrics at a glance",
    gradient: "from-primary to-accent",
  },
  {
    icon: Map,
    title: "Geospatial Map View",
    description: "Visualize project distribution across districts",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: LineChart,
    title: "Impact Simulator",
    description: "Predict outcomes of development decisions",
    gradient: "from-violet-400 to-purple-500",
  },
];

export function PlatformPreview() {
  return (
    <section id="solutions" className="py-16 md:py-24 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Platform Preview
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            See It in Action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            A glimpse into the most advanced constituency development platform
            ever built.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <div className="size-3 rounded-full bg-destructive" />
              <div className="size-3 rounded-full bg-warning" />
              <div className="size-3 rounded-full bg-success" />
              <div className="ml-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Monitor className="size-3" />
                <span>CDP Dashboard &mdash; Constituency Overview</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-6">
              <div className="col-span-2 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-4">
                    <div className="text-xs text-muted-foreground">
                      Total Projects
                    </div>
                    <div className="mt-1 text-2xl font-bold text-foreground">
                      1,847
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground">
                      Budget Utilized
                    </div>
                    <div className="mt-1 text-2xl font-bold text-success">
                      ₹2.4B
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className="h-2 w-2/3 rounded-full bg-success" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground">
                      Citizen Satisfaction
                    </div>
                    <div className="mt-1 text-2xl font-bold text-primary">
                      87%
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className="h-2 w-5/6 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    Project Priority Score
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "School Infrastructure", score: 94, color: "bg-primary" },
                      { label: "Healthcare Centers", score: 88, color: "bg-success" },
                      { label: "Road Connectivity", score: 76, color: "bg-warning" },
                      { label: "Water Supply", score: 92, color: "bg-accent" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="w-28 text-xs text-muted-foreground">
                          {item.label}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {item.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {previews.map((preview, i) => (
                  <div
                    key={preview.title}
                    className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    <div
                      className={`mb-3 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${preview.gradient} text-white`}
                    >
                      <preview.icon className="size-5" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {preview.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {preview.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Real-time Analytics", desc: "Live constituency data" },
              { label: "AI Predictions", desc: "Forecast development needs" },
              { label: "Citizen Feedback", desc: "NLP-powered insights" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="size-2 rounded-full bg-success" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
