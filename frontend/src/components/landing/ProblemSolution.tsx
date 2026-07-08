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
import { useTranslation } from "@/hooks/use-translation";

export function ProblemSolution() {
  const { t } = useTranslation();

  const problems = [
    {
      icon: Clock,
      title: t("landing.problem1Title"),
      description: t("landing.problem1Desc"),
    },
    {
      icon: FileText,
      title: t("landing.problem2Title"),
      description: t("landing.problem2Desc"),
    },
    {
      icon: BarChart3,
      title: t("landing.problem3Title"),
      description: t("landing.problem3Desc"),
    },
    {
      icon: MessageSquare,
      title: t("landing.problem4Title"),
      description: t("landing.problem4Desc"),
    },
  ];

  const solutions = [
    {
      icon: TrendingUp,
      title: t("landing.solution1Title"),
      description: t("landing.solution1Desc"),
    },
    {
      icon: Users,
      title: t("landing.solution2Title"),
      description: t("landing.solution2Desc"),
    },
    {
      icon: BarChart3,
      title: t("landing.solution3Title"),
      description: t("landing.solution3Desc"),
    },
    {
      icon: MessageSquare,
      title: t("landing.solution4Title"),
      description: t("landing.solution4Desc"),
    },
  ];

  return (
    <section id="problem-solution" className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-primary">
              {t("landing.problemSolutionTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.problemSolutionTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.problemSolutionSubtitle")}
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-danger/10">
                <XCircle className="size-5 text-danger" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t("landing.currentProblems")}
              </h3>
            </div>
            <div className="space-y-3">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-danger/20 hover:shadow-lg hover:shadow-danger/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger transition-transform group-hover:scale-110">
                      <problem.icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {problem.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:absolute lg:inset-y-0 lg:-left-6 lg:flex lg:items-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/25"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-success/10">
                  <CheckCircle className="size-5 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {t("landing.aiPoweredSolution")}
                </h3>
              </div>
              <div className="space-y-3">
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
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md transition-transform group-hover:scale-110">
                        <solution.icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {solution.title}
                        </h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
