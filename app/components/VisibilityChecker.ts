import { Time } from "@/lib/time";
import { useState, useEffect, useMemo } from "react";

const TARGET_TIMEZONE = "Asia/Jakarta";

export default function VisibilityChecker({ timeType }: { timeType: Time }) {
  const [clock, setClock] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isVisible = useMemo(() => {
    // 1. Format the current date into the target time zone parts
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: TARGET_TIMEZONE,
      hour12: false,
      weekday: "narrow", // Sunday is index 0 in Date, but here we'll grab it manually
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    const parts = formatter.formatToParts(clock);
    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || "0");

    // Get the Day of the Week for the target timezone
    // Note: clock.getDay() is local. We need the day in the target timezone.
    const dayFormatter = new Intl.DateTimeFormat("en-US", { 
      timeZone: TARGET_TIMEZONE, 
      weekday: "long" 
    });
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayFormatter.format(clock);
    const day = dayNames.indexOf(dayName); // 0 (Sun) - 6 (Sat)
    const hours = getPart("hour");
    const minutes = getPart("minute");
    const seconds = getPart("second");

    // Numeric comparison format: HHMMSS
    const currentTime = hours * 10000 + minutes * 100 + seconds;

    // 2. Visibility Logic
    const timeStr = Time[timeType];
    const isWeekday = day >= 1 && day <= 5;
    const isWeekend = day === 0 || day === 6;

    // Filter by Day Type (Suffix 7, 5, 2)
    if (timeStr.endsWith("5") && !isWeekday) return false;
    if (timeStr.endsWith("2") && !isWeekend) return false;

    // Filter by Time Range
    const ranges = {
      FIVE_AM: 50000,
      TEN_AM: 100000,
      TEN_15_PM: 221500,
      TEN_15_01_PM: 221501,
      FOUR_59_59_AM: 45959,
      SIX_AM: 60000,
      NINE_AM: 90000,
      FOUR_PM: 160000,
      EIGHT_PM: 200000,
    };


    if (timeStr.startsWith("DayNight")) return true;

    if (timeStr.startsWith("Day") && !timeStr.includes("Night")) {
      return currentTime >= ranges.FIVE_AM && currentTime <= ranges.TEN_15_PM;
    }

    if (timeStr.startsWith("Night")) {
      return currentTime >= ranges.TEN_15_01_PM || currentTime <= ranges.FOUR_59_59_AM;
    }

    if (timeStr.startsWith("AMRush")) {
      return currentTime >= ranges.SIX_AM && currentTime < ranges.NINE_AM;
    }

    if (timeStr.startsWith("PMRush")) {
      return currentTime >= ranges.FOUR_PM && currentTime < ranges.EIGHT_PM;
    }

    if (timeStr.startsWith("AMPMRush")) {
      return (currentTime >= ranges.SIX_AM && currentTime < ranges.NINE_AM) || 
             (currentTime >= ranges.FOUR_PM && currentTime < ranges.EIGHT_PM);
    }

    if (timeStr === "CFD") {
      return day === 0 &&        
            currentTime >= ranges.FIVE_AM &&
            currentTime < ranges.TEN_AM;
    }

    return false;
  }, [clock, timeType]);

  return isVisible;
}