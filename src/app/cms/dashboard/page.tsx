"use client"

import CustomerActiveComponent from "./content-overview/customerActive";
import BalanceComponent from "./content-overview/balance";

export default function DashboardPage() {
    return(
        <> 
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[10px] mt-[20px]">
            <BalanceComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
        </div>
        </>
    )
}