"use client"

import CustomerActiveComponent from "./content-overview/customerActive";
import BalanceComponent from "./content-overview/balance";

export default function DashboardPage() {
    return(
        <> 
        <div className="flex justify-between items-center gap-[10px] mt-[20px]">
            <BalanceComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
        </div>
        </>
    )
}