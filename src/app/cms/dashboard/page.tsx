"use client"

import CustomerActiveComponent from "./content-overview/customerActive";
import BalanceComponent from "./content-overview/balance";
import BookingAvgChart from "./content-chart/booking-avg";
import TotalBooking from "./content-overview/total-booking";
import TotalPackage from "./content-overview/total-package";
import PopularProvinceCard from "./content-chart/popular-province";
import TotalIncomeCard from "./content-chart/total-income";
import BookingOverview from "./content-overview/booking-overview";

export default function DashboardPage() {
    return(
        <> 
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[10px] mt-[20px]">
            <BalanceComponent />
            <TotalBooking />
            <TotalPackage />
            <CustomerActiveComponent />
        </div>
        <div className="w-full mt-[24px]">
            <div className="flex flex-col xl:hidden">
                <BookingAvgChart />
                <div className="mt-[20px] grid grid-cols-2 gap-[20px]">
                    <PopularProvinceCard />
                    <TotalIncomeCard />
                </div>
            </div>
            <div className="hidden xl:grid grid-cols-1 xl:grid-cols-3 gap-[20px] items-center">
                <BookingAvgChart />
                <PopularProvinceCard />
                <TotalIncomeCard />
            </div>
        </div>
        <div className="mt-[40px] w-full">
            <BookingOverview />
        </div>
        </>
    )
}