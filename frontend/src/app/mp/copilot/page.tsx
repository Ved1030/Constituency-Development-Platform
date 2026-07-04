"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  BarChart3,
  MapPin,
  IndianRupee,
  Users,
  AlertTriangle,
  TrendingUp,
  FileText,
  Globe,
  Clock,
  ChevronRight,
  Lightbulb,
  Database,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: string;
}

const mockConversation: Message[] = [
  {
    id: "m1",
    role: "user",
    content: "What are the top 3 water supply issues in my constituency?",
    timestamp: "10:32 AM",
  },
  {
    id: "m2",
    role: "assistant",
    content: `Based on my analysis of North Chennai's water supply infrastructure, here are the top 3 critical issues:\n\n**1. Velachery Pipeline Age Crisis**\nThe water pipeline network in Velachery is averaging 23 years old, with 34% of pipes showing signs of corrosion. This has led to a 78% probability of supply failure within the next 3 months. The area serves approximately 21,500 residents.\n\n**2. Krishna Nagar Water Pressure Drop**\nRecent sensor data shows a 42% drop in water pressure in Krishna Nagar wards. Root cause analysis indicates blockages in the main distribution line and insufficient pump capacity.\n\n**3. Southern Ward Groundwater Depletion**\n3 borewells in southern wards (Velachery, Sholinganallur) are showing water levels below 15m, which is critically low. Seasonal demand patterns suggest this will worsen during summer months.\n\n**Recommended Actions:**\n- Allocate ₹1.2 Cr for emergency pipeline audit in Velachery\n- Deploy 2 additional water tankers to Krishna Nagar as temporary measure\n- Commission groundwater recharge project for southern wards\n\nThese findings are based on consumption data from the last 18 months, infrastructure age records, and seasonal forecasting models.`,
    sources: ["Water Infrastructure Database", "Sensor Network Data", "Consumption Analytics", "Groundwater Level Records", "Seasonal Forecasting Model"],
    timestamp: "10:32 AM",
  },
];

const contextPanel = {
  constituency: "North Chennai",
  state: "Tamil Nadu",
  population: "18,42,500",
  villages: 142,
  wards: 72,
  totalComplaints: 3847,
  waterComplaints: 645,
  budget: "₹37.7 Cr",
  aiScore: 87,
};

export default function MPCopilotPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(mockConversation);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const promptSuggestions = [
    { icon: AlertTriangle, text: t("mp.copilot.promptInfrastructure"), category: t("mp.copilot.catInfrastructure") },
    { icon: IndianRupee, text: t("mp.copilot.promptBudget"), category: t("mp.copilot.catBudget") },
    { icon: TrendingUp, text: t("mp.copilot.promptPerformance"), category: t("mp.copilot.catPerformance") },
    { icon: Users, text: t("mp.copilot.promptCitizenFeedback"), category: t("mp.copilot.catCitizenFeedback") },
    { icon: Globe, text: t("mp.copilot.promptDecisionSupport"), category: t("mp.copilot.catDecisionSupport") },
    { icon: FileText, text: t("mp.copilot.promptPolicy"), category: t("mp.copilot.catPolicy") },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: `m${Date.now()}`,
        role: "assistant",
        content: `I've analyzed your query regarding "${input}". Based on the current constituency data for North Chennai:\n\n**Key Findings:**\n- Your constituency has 3,847 active complaints across 142 villages and 72 wards\n- The AI health score stands at 87/100, indicating strong governance metrics\n- Budget utilization is at 81.2% with ₹37.7 Cr total allocation\n\n**AI Recommendation:**\nI recommend reviewing the priority engine dashboard for real-time alerts. The water supply and sanitation departments show the highest AI risk scores, requiring immediate attention.\n\nWould you like me to generate a detailed report or schedule an action plan?`,
        sources: ["Constituency Analytics Engine", "Real-time Complaint Feed", "Budget Tracking System"],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0 -m-4 lg:-m-6">
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
            <Bot className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t("mp.copilot.aiMPCopilot")}</h1>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-600">{t("mp.copilot.online")}</span>
              <span className="text-[11px] text-muted-foreground">&middot; {t("mp.copilot.poweredBy")}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-background">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-purple-50 border border-purple-200">
                <Sparkles className="size-8 text-purple-600" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-foreground">{t("mp.copilot.whatCanIHelp")}</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t("mp.copilot.askAnything")}
              </p>

              {/* Prompt Suggestions */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
                {promptSuggestions.map((suggestion, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setInput(suggestion.text)}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-purple-200 hover:shadow-md"
                  >
                    <suggestion.icon className="size-4 mt-0.5 shrink-0 text-purple-400 group-hover:text-purple-600" />
                    <div>
                      <span className="text-[10px] font-semibold text-purple-500 uppercase">{suggestion.category}</span>
                      <div className="mt-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">{suggestion.text}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-4", msg.role === "user" ? "justify-end" : "")}
            >
              {msg.role === "assistant" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                  <Bot className="size-4 text-white" />
                </div>
              )}
              <div className={cn(
                "max-w-2xl rounded-2xl px-5 py-4",
                msg.role === "user"
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-card border border-border shadow-sm",
              )}>
                <div className="prose prose-sm max-w-none">
                  {msg.content.split("\n").map((line, j) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={j} className="font-semibold text-foreground mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
                    }
                    if (line.startsWith("- ")) {
                      return <p key={j} className="text-sm text-muted-foreground ml-4 before:content-['•'] before:mr-2 before:text-muted-foreground">{line.slice(2)}</p>;
                    }
                    if (line.trim() === "") return <div key={j} className="h-2" />;
                    return <p key={j} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
                  })}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 border-t border-border pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Database className="size-3 text-muted-foreground" />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">{t("mp.copilot.sources")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((source) => (
                        <span key={source} className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                          <ExternalLink className="size-2.5" />
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Clock className="size-3" />
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-4"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                  <Bot className="size-4 text-white" />
                </div>
                <div className="rounded-2xl bg-card border border-border px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="size-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="size-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="size-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{t("mp.copilot.analyzingData")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t("mp.copilot.askQuestion")}
                rows={1}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                "flex size-11 items-center justify-center rounded-xl transition-all",
                input.trim()
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Send className="size-5" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{t("mp.copilot.disclaimer")}</span>
            <span>North Chennai &middot; {t("mp.copilot.updatedAgo")}</span>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="hidden w-72 border-l border-border bg-card overflow-y-auto xl:block">
        <div className="p-4">
          <h3 className="mb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("mp.copilot.constituencyContext")}</h3>
          <div className="space-y-2">
            {[
              { label: t("mp.copilot.constituency"), value: contextPanel.constituency },
              { label: t("mp.copilot.state"), value: contextPanel.state },
              { label: t("mp.copilot.population"), value: contextPanel.population },
              { label: t("mp.copilot.villages"), value: contextPanel.villages },
              { label: t("mp.copilot.wards"), value: contextPanel.wards },
              { label: t("mp.copilot.totalComplaints"), value: contextPanel.totalComplaints.toLocaleString("en-IN") },
              { label: t("mp.copilot.waterComplaints"), value: contextPanel.waterComplaints },
              { label: t("mp.copilot.budget"), value: contextPanel.budget },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-[11px] text-muted-foreground">{item.label}</span>
                <span className="text-[11px] font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("mp.copilot.aiScore")}</h3>
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="relative size-14">
                  <svg className="size-full -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="24" fill="none" stroke="url(#aiScoreGrad)" strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(contextPanel.aiScore / 100) * 150.8} 150.8`}
                    />
                    <defs>
                      <linearGradient id="aiScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{contextPanel.aiScore}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t("mp.copilot.excellent")}</div>
                  <div className="text-[11px] text-muted-foreground">{t("mp.copilot.topNationally")}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("mp.copilot.quickActions")}</h3>
            <div className="space-y-1.5">
              {[
                { label: t("mp.copilot.generatePolicyReport"), icon: FileText },
                { label: t("mp.copilot.budgetOptimization"), icon: IndianRupee },
                { label: t("mp.copilot.compareProjects"), icon: BarChart3 },
                { label: t("mp.copilot.impactSimulation"), icon: Globe },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                >
                  <action.icon className="size-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
