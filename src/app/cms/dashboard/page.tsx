"use client"

import CustomerActiveComponent from "./content-overview/customerActive";
import BalanceComponent from "./content-overview/balance";
import BookingAvgChart from "./content-chart/booking-avg";

export default function DashboardPage() {
    return(
        <> 
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[10px] mt-[20px]">
            <BalanceComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
        </div>
        <div className="w-full mt-[24px]">
            <div className="flex flex-col xl:hidden">
                <BookingAvgChart />
                <div className="mt-[20px] grid grid-cols-2 gap-[20px]">
                    <BookingAvgChart />
                    <BookingAvgChart />
                </div>
            </div>
            <div className="hidden xl:grid grid-cols-1 xl:grid-cols-3 gap-[20px] items-center">
                <BookingAvgChart />
                <BookingAvgChart />
                <BookingAvgChart />
            </div>
        </div>
        </>
    )
}