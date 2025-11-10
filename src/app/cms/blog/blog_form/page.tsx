import { Suspense } from "react";
import BlogForm from "./form";
import PackageFormLoader from "@/app/components/loader/packageForm-loader";

export default function BlogFormPage() {
    return(
        <Suspense fallback={<PackageFormLoader />}>
            <BlogForm />
        </Suspense>
    );
};