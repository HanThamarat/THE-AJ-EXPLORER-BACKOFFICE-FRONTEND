"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { useSelector } from "react-redux";
import { getPopularProvince, kpiSelector } from "@/app/store/slice/kpiSlice";
import { popularProviceType } from "@/app/types/kpi";
import DefaultEmpty from "@/app/components/empty/default-emtpy";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function PopularProvinceCard() {

  const dispatch = useAppDispatch();
  const { popolarProvince } = useSelector(kpiSelector);
  const [isLoading, setIsLoading] = useState(true);
  const isFaching = useRef(false);
  const [popular, setPopular] = useState<popularProviceType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isFaching.current) return;
      isFaching.current = true;

      setIsLoading(true);
      await dispatch(getPopularProvince());
      setIsLoading(false);

      isFaching.current = false;
    };

    if (popolarProvince === null) {
      fetchData();
      return;
    }

    setPopular(popolarProvince);
    setIsLoading(false);
  }, [dispatch, popolarProvince]);

  const total = useMemo(
    () => popular.reduce((sum, x) => sum + x.qty, 0) || 1,
    [popular]
  );

  const labels = useMemo(() => popular.map((x) => x.provinceName), [popular]);

  const valuesPct = useMemo(
    () => popular.map((x) => Math.round((x.qty / total) * 100)),
    [popular, total]
  );

  const colors = useMemo(() => {
    const palette = ["#0B2A3A", "#D9C6FF", "#0B2A3A", "#C9D6FF"];
    return popular.map((_, i) => palette[i % palette.length]);
  }, [popular]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: valuesPct,
          borderRadius: 5,
          barThickness: 20,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    }),
    [labels, valuesPct, colors]
  );

  // tooltip uses popular, so include it in deps
  const options: any = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: (ctx: any) => {
              const pct = ctx.parsed.x ?? 0;
              const rawQty = popular[ctx.dataIndex]?.qty ?? 0;
              return ` ${pct}% (${rawQty})`;
            },
            title: () => "",
          },
        },
      },
      scales: {
        y: {
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: {
            color: "#6B6FA6",
            font: { size: 12, weight: "500" },
          },
        },
        x: {
          min: 0,
          max: 100,
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: {
            stepSize: 50,
            color: "#6B6FA6",
            callback: (value: any) => `${value}%`,
            font: { size: 12, weight: "500" },
          },
        },
      },
    }),
    [popular]
  );

  return (
    <div className="w-full bg-white h-full rounded-3xl p-8">
      <div>
        <h2 className="text-gray-400 text-sm font-medium mb-1">Statistics</h2>
        <h1 className="text-2xl font-bold text-[#0f172a]">Popular province</h1>
      </div>

      <div className="w-full mt-6 h-64">
        {isLoading ? (
          <div className="w-full animate-pulse mt-[50px] duration-100 grid grid-cols-1 gap-[10px] ease-linear">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-[20px] bg-gray-200 rounded-[10px]" />
            ))}
          </div>
        ) : popular.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center">
            <DefaultEmpty />
          </div>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}