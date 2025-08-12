import React from "react";

export default function CMSLayout({
    children
}: Readonly<{children: React.ReactNode}>) {
    return(
        <>
            {children}
        </>
    );
};