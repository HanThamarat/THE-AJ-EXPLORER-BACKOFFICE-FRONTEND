import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChevronDown, Check } from 'lucide-react';
import { getBookingAvg } from '@/app/store/slice/bookingSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hook/appDispatch';
import { bookingSelector } from '@/app/store/slice/bookingSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function BookingAvgChart({

}) {

    const dispatch = useAppDispatch();
    const { bookingAbg } = useSelector(bookingSelector);
    const [timeRange, setTimeRange] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [chartConfig, setCharConfig] = useState({
        Weekly: { labels: [], data: [], activeIndex: -1, yMax: 5000, yStep: 1000 },
        Monthly: { labels: [], data: [], activeIndex: -1, yMax: 5000, yStep: 1000 },
        Yearly: { labels: [], data: [], activeIndex: -1, yMax: 5000, yStep: 1000 },
    })
    const [isLoading, setIsloading] = useState<boolean>(true); 
    const isFaching = useRef<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getBookingAvg(timeRange));
            isFaching.current = false;
        };

        fetchData();
    }, [dispatch, timeRange]);

    useEffect(() => {
        if (bookingAbg !== null) {
            if (bookingAbg.type === "Weekly") {
               setCharConfig(prev => ({
                    ...prev, 
                    Weekly: {
                        labels: bookingAbg.data.map((data) => (data.name as never)),
                        data: bookingAbg.data.map((data) => (data.avg as never)),
                        activeIndex: bookingAbg.data.length ? bookingAbg.data.reduce((maxIdx, item, idx, arr) => item.avg > arr[maxIdx].avg ? idx : maxIdx, 0) : 0,
                        yMax: Math.max(...bookingAbg.data.map(item => item.avg)) + 1,
                        yStep: Math.min(...bookingAbg.data.map(item => item.avg)),
                    }
               }));
               setIsloading(false);
            } else if (bookingAbg.type === "Monthly") {
              setCharConfig(prev => ({
                    ...prev, 
                    Monthly: {
                        labels: bookingAbg.data.map((data) => (data.name as never)),
                        data: bookingAbg.data.map((data) => (data.avg as never)),
                        activeIndex: bookingAbg.data.length ? bookingAbg.data.reduce((maxIdx, item, idx, arr) => item.avg > arr[maxIdx].avg ? idx : maxIdx, 0) : 0,
                        yMax: Math.max(...bookingAbg.data.map(item => item.avg)) + 1,
                        yStep: Math.min(...bookingAbg.data.map(item => item.avg)),
                    }
               }));
               setIsloading(false);
            } else if (bookingAbg.type === "Yearly") {
                 setCharConfig(prev => ({
                    ...prev, 
                    Yearly: {
                        labels: bookingAbg.data.map((data) => (data.name as never)),
                        data: bookingAbg.data.map((data) => (data.avg as never)),
                        activeIndex: bookingAbg.data.length ? bookingAbg.data.reduce((maxIdx, item, idx, arr) => item.avg > arr[maxIdx].avg ? idx : maxIdx, 0) : 0,
                        yMax: Math.max(...bookingAbg.data.map(item => item.avg)) + 1,
                        yStep: Math.min(...bookingAbg.data.map(item => item.avg)),
                    }
               }));
               setIsloading(false);
            } 
        }
    }, [bookingAbg]);

    const currentConfig = chartConfig[timeRange];

    // Colors
    const activeColor = '#0f344f'; // Dark Navy
    const inactiveColor = '#f0eaff'; // Light Lavender
    const tooltipBg = '#1e1b4b'; // Deep Indigo/Black for tooltip

    const data = {
        labels: currentConfig.labels,
        datasets: [
        {
            data: currentConfig.data,
            backgroundColor: (context: any) => {
            const index = context.dataIndex;
            return index === currentConfig.activeIndex ? activeColor : inactiveColor;
            },
            hoverBackgroundColor: (context: any) => {
            const index = context.dataIndex;
            return index === currentConfig.activeIndex ? activeColor : '#dcd1fc';
            },
            borderRadius: Number.MAX_VALUE,
            borderSkipped: false,
            // Dynamically adjust bar thickness based on number of items
            barThickness: timeRange === 'Monthly' ? 16 : 28, 
        },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: { display: false },
        tooltip: {
            enabled: true,
            backgroundColor: tooltipBg,
            titleColor: '#fff',
            titleFont: { family: 'sans-serif', size: 14, weight: '600' },
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            yAlign: 'bottom',
            callbacks: {
            title: () => '',
            label: (context: any) => context.raw.toLocaleString(),
            },
        },
        },
        scales: {
        x: {
            grid: { display: false, drawBorder: false },
            border: { display: false },
            ticks: {
            color: '#64748b',
            font: { size: 11, family: 'sans-serif' },
            padding: 10,
            },
        },
        y: {
            min: 0,
            max: currentConfig.yMax, // Dynamic Max
            ticks: {
            stepSize: currentConfig.yStep, // Dynamic Step
            callback: (value: number) => {
                return value <= 999 ? value : (value === 0 ? '0' : value / 1000 + 'k')
            },
            color: '#94a3b8',
            font: { size: 11 },
            padding: 10,
            },
            grid: {
            color: '#f1f5f9',
            borderDash: [5, 5],
            drawBorder: false,
            drawTicks: false,
            },
            border: { display: false },
        },
        },
        layout: {
        padding: { top: 20 },
        },
        animation: {
        duration: 800,
        easing: 'easeOutQuart',
        },
    };


    return(
        <div className="w-full h-full bg-white rounded-3xl p-8">
            
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
                <h2 className="text-gray-400 text-sm font-medium mb-1">Activity</h2>
                <h1 className="text-2xl font-bold text-[#0f172a]">Average books</h1>
            </div>
            
            {/* Dropdown Container */}
            <div className="relative">
                <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-slate-600 text-sm font-medium px-4 py-2 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-indigo-200"
                >
                <span>{timeRange}</span>
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                    {Object.keys(chartConfig).map((range) => (
                    <button
                        key={range}
                        onClick={() => {
                        setTimeRange(range as 'Weekly' | 'Monthly' | 'Yearly');
                        setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-900 flex items-center justify-between"
                    >
                        {range}
                        {timeRange === range && <Check size={14} className="text-indigo-600" />}
                    </button>
                    ))}
                </div>
                )}
                
                {/* Backdrop to close dropdown on click outside */}
                {isDropdownOpen && (
                <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setIsDropdownOpen(false)}
                />
                )}
            </div>
            </div>

            {/* Chart Section */}
            <div className="relative h-64 w-full">
                {
                    isLoading ?
                    <div className='w-full  mt-[50px] animate-pulse duration-100 grid grid-cols-1 gap-[10px] ease-linear'>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                        <div className='w-full h-[20px] bg-gray-200 rounded-[10px]'></div>
                    </div>
                    :
                    <Bar data={data} options={options as any} />
                }
            </div>
        </div>
    );
}