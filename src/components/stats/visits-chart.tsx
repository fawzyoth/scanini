"use client";

import { VisitData } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Eye } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface VisitsChartProps {
  data: VisitData[];
}

export function VisitsChart({ data }: VisitsChartProps) {
  const { t } = useTranslation();
  const total = data.reduce((sum, d) => sum + d.mornings + d.afternoons, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("stats.visits")}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {total > 0 ? `${total} ${t("stats.scansInPeriod")}` : t("stats.qrScansOverTime")}
          </p>
        </div>
        <div className="text-3xl font-bold text-gray-900">{total}</div>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend />
            <Bar dataKey="afternoons" name={t("stats.afternoons")} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mornings" name={t("stats.mornings")} fill="#93c5fd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Eye size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">{t("stats.noScansYet")}</p>
          <p className="text-xs text-gray-500 mt-1">{t("stats.shareQrToTrack")}</p>
        </div>
      )}
    </div>
  );
}
