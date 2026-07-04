"use client";

import { motion } from "framer-motion";
import {
  XCircle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Slow Decision Making",
    description: "Months of delay in identifying and prioritizing community needs.",
  },
  {
    icon: FileText,
    title: "Data Silos",
    description: "Citizen feedback trapped in unorganized channels and paperwork.",
  },
  {
    icon: BarChart3,
    title: "No Impact Visibility",
    description: "Unable to measure or predict the outcome of development projects.",
  },
  {
    icon: MessageSquare,
    title: "Language Barriers",
    description: "Citizen voices lost in translation across diverse languages.",
  },
];

const solutions = [
  {
    icon: TrendingUp,
    title: "Real-Time AI Analysis",
    description: "Instant processing of citizen feedback with NLP-powered sentiment analysis.",
  },
  {
    icon: Users,
    title: "Unified Platform",
    description: "All stakeholder communication in one centralized, transparent system.",
  },
  {
    icon: BarChart3,
    title: "Impact Simulator",
    description: "Predict development outcomes before allocating resources.",
  },
  {
    icon: MessageSquare,
    title: "Multilingual AI",
    description: "12+ Indian languages supported with AI translation and analysis.",
  },
];

export function ProblemSolution() {
  return (
    <section id="problem-solution" className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Problem vs Solution
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            From Challenges to AI-Powered Solutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Replacing outdated processes with intelligent, data-driven governance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <XCircle className="size-5" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Current Problems
              </h3>
            </div>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-destructive/20 hover:shadow-lg hover:shadow-destructive/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                      <problem.icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {problem.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center">
            <div className="hidden lg:absolute lg:inset-y-0 lg:-left-8 lg:flex lg:items-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/25">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <CheckCircle className="size-5" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  AI-Powered Solution
                </h3>
              </div>
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <motion.div
                    key={solution.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-success/20 hover:shadow-lg hover:shadow-success/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                        <solution.icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {solution.title}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
