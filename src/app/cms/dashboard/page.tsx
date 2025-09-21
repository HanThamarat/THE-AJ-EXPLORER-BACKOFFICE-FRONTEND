"use client"

import CustomerActiveComponent from "./content-overview/customerActive"

export default function DashboardPage() {
    return(
        <> 
        <div className="flex justify-between items-center gap-[10px] mt-[20px]">
            <CustomerActiveComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
            <CustomerActiveComponent />
        </div>
        </>
    )
}