"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { getTotalIncome, kpiSelector } from "@/app/store/slice/kpiSlice";
import { bookingAvgDataType } from "@/app/types/booking";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const monthLabel = (m: string) => m.slice(0, 1) + m.slice(1, 3).toLowerCase(); // JAN -> Jan

const formatK = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return `${value}`;
};

// plugin: dashed vertical line at activeIndex
const activeVerticalLinePlugin: Plugin<"line"> = {
  id: "activeVerticalLine",
  afterDatasetsDraw(chart, _args, pluginOptions: any) {
    const activeIndex: number | undefined = pluginOptions?.activeIndex;
    if (activeIndex === undefined || activeIndex < 0) return;

    const meta = chart.getDatasetMeta(0);
    const point = meta.data?.[activeIndex];
    if (!point) return;

    const { ctx, chartArea } = chart;
    const x = (point as any).x;

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top + 6);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  },
};

export default function TotalIncomeCard() {

  const dispatch = useAppDispatch();
  const { totalIncome } = useSelector(kpiSelector);
  const [isLoading, setIsLoading] = useState(true);
  const isFaching = useRef(false);
  const [income, setIncome] = useState<bookingAvgDataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isFaching.current) return;
      isFaching.current = true;

      setIsLoading(true);
      await dispatch(getTotalIncome());
      setIsLoading(false);

      isFaching.current = false;
    };

    if (totalIncome === null) {
      fetchData();
      return;
    }

    setIncome(totalIncome);
    setIsLoading(false);
  }, [dispatch, totalIncome]);

  // show Jan–Jun like screenshot (change to mockIncome for Jan–Dec)
  const visible = useMemo(() => income.slice(0, 12), [income]);

  const labels = useMemo(() => visible.map((x) => monthLabel(x.name)), [visible]);
  const values = useMemo(() => visible.map((x) => x.avg), [visible]);

  const activeIndex = useMemo(() => {
    if (!values.length) return -1;
    const max = Math.max(...values);
    return values.indexOf(max);
  }, [values]);

  const maxVal = useMemo(() => Math.max(...values, 0), [values]);
  const suggestedMax = useMemo(() => {
    const base = maxVal <= 0 ? 100000 : maxVal * 1.4;
    const step = 50000;
    return Math.ceil(base / step) * step;
  }, [maxVal]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Package",
          data: values,
          borderColor: "#0B2A3A",
          borderWidth: 3,
          tension: 0.45,
          fill: false,
          pointRadius: (ctx: any) => (ctx.dataIndex === activeIndex ? 6 : 0),
          pointHoverRadius: 6,
          pointBackgroundColor: "#0B2A3A",
          pointBorderColor: (ctx: any) => (ctx.dataIndex === activeIndex ? "#FFFFFF" : "#0B2A3A"),
          pointBorderWidth: (ctx: any) => (ctx.dataIndex === activeIndex ? 3 : 2),
        },
      ],
    }),
    [labels, values, activeIndex]
  );

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 8, right: 8, top: 8, bottom: 0 } },

      // ✅ make hover easier
      interaction: { mode: "nearest", intersect: false },
      hover: { mode: "nearest", intersect: false },

      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: (items: any) => items[0]?.label ?? "",
            label: (ctx: any) => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()}`,
          },
        },

        // pass activeIndex into plugin
        activeVerticalLine: { activeIndex },
      } as any,

      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: {
            color: "#6B6FA6",
            font: { size: 12, weight: "500" },
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax,
          grid: {
            color: "#E9EEF7",
            drawBorder: false,
          },
          border: { display: false },
          ticks: {
            color: "#6B6FA6",
            font: { size: 12, weight: "500" },
            callback: (val) => formatK(Number(val)),
          },
        },
      },
    }),
    [activeIndex, suggestedMax]
  );

  const totalIncomes = useMemo(() => values.reduce((s, v) => s + v, 0), [values]);

  return (
    <div className="w-full bg-white rounded-3xl p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Statistics</p>
          <h2 className="text-2xl font-bold text-[#0f172a]">Total income</h2>
          <p className="mt-2 text-sm text-slate-400">{totalIncomes.toLocaleString()} total</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-[#0B2A3A]" />
          <span className="text-sm text-slate-500">Booking</span>
        </div>
      </div>
        
      <div className="w-full mt-6 h-64">
        {isLoading ? (
          <div className="w-full animate-pulse duration-100 grid grid-cols-1 gap-[10px] ease-linear">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-[20px] bg-gray-200 rounded-[10px]" />
            ))}
          </div>
        ) : income.length === 0 ? (
          <div className="text-sm text-gray-400">No data</div>
        ) : (
          <Line data={data} options={options} plugins={[activeVerticalLinePlugin]} />
        )}
      </div>
    </div>
  );
}
