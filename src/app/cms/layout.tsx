import React from "react";
import SideBar from "./layout/sideBar";
import Nav from "./layout/Nav";

export default function CMSLayout({
    children
}: Readonly<{children: React.ReactNode}>) {
    return(
        <>
        <div className="flex h-screen">
            <SideBar />
            <div className="w-full">   
                <Nav />
                <div className="p-[20px] overflow-y-scroll h-[90vh]">
                    {children}
                </div>
            </div>
        </div>
        </>
    );
};