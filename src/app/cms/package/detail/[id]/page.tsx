"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react";

export default function PackageDetail() {

    const param = useParams();
    const packageId = param.id;

    useEffect(() => {
        console.log(packageId);
        
    }, []);

    return(
        <>

        </>
    )
}