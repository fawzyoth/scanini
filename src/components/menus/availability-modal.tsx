"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "@/components/ui";
import { Clock } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const PRESETS = [
  { label: "Every day", days: DAYS },
  { label: "Weekdays", days: DAYS.slice(0, 5) },
  { label: "Weekends", days: DAYS.slice(5) },
];

interface DaySchedule {
  enabled: boolean;
  from: string;
  to: string;
}

type Schedule = Record<string, DaySchedule>;

interface AvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  currentAvailability: string;
  onSave: (availability: string) => void;
}

function defaultSchedule(): Schedule {
  const s: Schedule = {};
  for (const day of DAYS) {
    s[day] = { enabled: true, from: "00:00", to: "23:59" };
  }
  return s;
}

function parseAvailability(availability: string): Schedule {
  const s = defaultSchedule();
  const lower = availability.toLowerCase();

  // Disable all first, then enable matching days
  for (const day of DAYS) s[day].enabled = false;

  // Try to extract time part like "11:00-14:00"
  const timeMatch = availability.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
  const from = timeMatch ? timeMatch[1] : "00:00";
  const to = timeMatch ? timeMatch[2] : "23:59";

  let matchedDays: string[] = [];

  if (lower.includes("every day")) {
    matchedDays = [...DAYS];
  } else if (lower === "weekdays" || lower === "mon-fri") {
    matchedDays = DAYS.slice(0, 5);
  } else if (lower === "weekends" || lower === "sat-sun") {
    matchedDays = DAYS.slice(5);
  } else {
    const dayMap: Record<string, string> = {
      mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
      fri: "Friday", sat: "Saturday", sun: "Sunday",
    };
    const cleanedLower = lower.replace(/\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2}/, "").trim();
    const parts = cleanedLower.split(/[-,\s]+/).filter(Boolean);
    if (parts.length === 2 && dayMap[parts[0]] && dayMap[parts[1]]) {
      const start = DAYS.indexOf(dayMap[parts[0]]);
      const end = DAYS.indexOf(dayMap[parts[1]]);
      if (start >= 0 && end >= 0) {
        matchedDays = DAYS.slice(start, end + 1);
      }
    }
    if (matchedDays.length === 0) {
      // Fallback: enable all
      matchedDays = [...DAYS];
    }
  }

  for (const day of matchedDays) {
    s[day] = { enabled: true, from, to };
  }
  return s;
}

function formatSchedule(schedule: Schedule): string {
  const enabledDays = DAYS.filter((d) => schedule[d].enabled);
  if (enabledDays.length === 0) return "Never";

  // Check if all days have same time
  const times = enabledDays.map((d) => `${schedule[d].from}-${schedule[d].to}`);
  const allSameTime = times.every((t) => t === times[0]);
  const isAllDay = allSameTime && times[0] === "00:00-23:59";

  // Format days part
  let daysPart: string;
  if (enabledDays.length === 7) {
    daysPart = "Every day";
  } else if (enabledDays.length === 5 && enabledDays.every((d, i) => d === DAYS[i])) {
    daysPart = "Mon-Fri";
  } else if (enabledDays.length === 2 && enabledDays[0] === "Saturday" && enabledDays[1] === "Sunday") {
    daysPart = "Sat-Sun";
  } else {
    const indices = enabledDays.map((d) => DAYS.indexOf(d)).sort((a, b) => a - b);
    const isContiguous = indices.every((v, i) => i === 0 || v === indices[i - 1] + 1);
    if (isContiguous && indices.length >= 2) {
      const abbr = (d: string) => d.slice(0, 3);
      daysPart = `${abbr(DAYS[indices[0]])}-${abbr(DAYS[indices[indices.length - 1]])}`;
    } else {
      daysPart = enabledDays.map((d) => d.slice(0, 3)).join(", ");
    }
  }

  if (isAllDay) return daysPart;
  if (allSameTime) return `${daysPart} ${schedule[enabledDays[0]].from}-${schedule[enabledDays[0]].to}`;
  return daysPart;
}

export function AvailabilityModal({ open, onClose, currentAvailability, onSave }: AvailabilityModalProps) {
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);

  useEffect(() => {
    if (open) setSchedule(parseAvailability(currentAvailability));
  }, [open, currentAvailability]);

  function toggleDay(day: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  }

  function updateTime(day: string, field: "from" | "to", value: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  function applyPreset(days: string[]) {
    const s = defaultSchedule();
    for (const day of DAYS) s[day].enabled = false;
    for (const day of days) s[day] = { enabled: true, from: "00:00", to: "23:59" };
    setSchedule(s);
  }

  function applyTimeToAll() {
    const firstEnabled = DAYS.find((d) => schedule[d].enabled);
    if (!firstEnabled) return;
    const { from, to } = schedule[firstEnabled];
    setSchedule((prev) => {
      const next = { ...prev };
      for (const day of DAYS) {
        if (next[day].enabled) {
          next[day] = { ...next[day], from, to };
        }
      }
      return next;
    });
  }

  function handleSave() {
    onSave(formatSchedule(schedule));
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Adjust availability" size="md">
      <div className="space-y-4">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.days)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Day schedules */}
        <div className="space-y-1.5">
          {DAYS.map((day) => {
            const ds = schedule[day];
            return (
              <div
                key={day}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg transition-colors ${
                  ds.enabled ? "bg-indigo-50" : "bg-gray-50"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleDay(day)}
                  className="shrink-0"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      ds.enabled ? "bg-indigo-600 border-indigo-600" : "border-gray-300"
                    }`}
                  >
                    {ds.enabled && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Day name */}
                <span className={`text-sm w-20 sm:w-24 shrink-0 ${ds.enabled ? "font-medium text-indigo-700" : "text-gray-400"}`}>
                  {day.slice(0, 3)}
                  <span className="hidden sm:inline">{day.slice(3)}</span>
                </span>

                {/* Time inputs */}
                {ds.enabled ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                    <Clock size={14} className="text-indigo-400 hidden sm:block" />
                    <input
                      type="time"
                      value={ds.from}
                      onChange={(e) => updateTime(day, "from", e.target.value)}
                      className="text-xs sm:text-sm bg-white border border-indigo-200 rounded-md px-1.5 sm:px-2 py-1 text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[80px] sm:w-auto"
                    />
                    <span className="text-xs text-indigo-400">to</span>
                    <input
                      type="time"
                      value={ds.to}
                      onChange={(e) => updateTime(day, "to", e.target.value)}
                      className="text-xs sm:text-sm bg-white border border-indigo-200 rounded-md px-1.5 sm:px-2 py-1 text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[80px] sm:w-auto"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 ml-auto">Closed</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Apply to all */}
        <button
          onClick={applyTimeToAll}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Apply first day&apos;s time to all active days
        </button>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
