"use client"

import PackageFormLoader from "@/app/components/loader/packageForm-loader";
import { Suspense } from "react";
import PacakageFormComponent from "./components/form";

export default function PacakageForm() {

    return(
       <Suspense
        fallback={<PackageFormLoader />}
       >
        <PacakageFormComponent />
       </Suspense>
    );
}