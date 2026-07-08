"use client";

import { KPIRow } from "@/components/dashboard/KPIRow";
import { DigitalTwinPreview } from "@/components/map/DigitalTwinPreview";
import { NeedVsSpend } from "@/components/dashboard/NeedVsSpend";
import { Row6 } from "@/components/dashboard/MPLADSProjects";
import { DashboardRightPanel } from "@/components/dashboard/DashboardRightPanel";

export default function MPDashboardPage() {
  return (
    <div className="pb-10 space-y-4">
      {/* ─── 6 KPI Cards ─── */}
      <KPIRow />

      {/* ─── Main Dashboard Grid: 12-column layout ─── */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* ─── LEFT: 8 columns ─── */}
          <div className="space-y-4 xl:col-span-8">
            {/* Digital Twin Map */}
            <DigitalTwinPreview />

            {/* Need vs Spend */}
            <NeedVsSpend />

            {/* MPLADS + Projects + AI Insights (3-column row) */}
            <Row6 />
          </div>

          {/* ─── RIGHT: 4 columns ─── */}
          <div className="xl:col-span-4">
            <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto pr-1 scrollbar-thin">
              <DashboardRightPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
