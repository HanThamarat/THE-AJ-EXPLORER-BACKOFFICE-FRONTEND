"use client"

import DefaultButton from "@/app/components/button/default-button";
import { FiEdit, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { blogSelector } from "@/app/store/slice/blogManagement";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { getAllBlogs } from "@/app/store/slice/blogManagement";
import { BlogDataTableType, BlogEntitySchemaType } from "@/app/types/blog";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import TableLoader from "@/app/components/loader/tableLoader";
import DataTable from "@/app/components/table/dataTable";
import DefaultEmpty from "@/app/components/empty/default-emtpy";

export default function BlogPage() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { blogs } = useSelector(blogSelector);
    const isFacting = useRef(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [blogTableData, setBlogDataTable] = useState<BlogDataTableType[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const fecthBlogsData = async () => {
            if (isFacting.current) return;
            isFacting.current = true;
            await dispatch(getAllBlogs());
            isFacting.current = false; 
        }

        blogs === null && fecthBlogsData();

        if (blogs?.length !== 0 && blogs !== null) {
            const blogFormetter: BlogDataTableType[] = blogs.map((data: BlogEntitySchemaType, key) => ({
                index:  key + 1,
                id: data.id,
                blogName: data.title,
                type: data.blogtype as string,
                status: data.status,
                createdBy: data.created_by as string,
                updatedAt: data.updated_at,
                updatedBy: data.updated_by as string,
            }));
            setBlogDataTable(blogFormetter);
        }

        blogs !== null && setIsLoading(false);
    }, [dispatch, blogs]);

    const columns: ColumnDef<BlogDataTableType>[] = [
        {
            accessorKey: "index",
            header: "#"
        },
        {
            accessorKey: "blogName",
            header: "Blog name"
        },
        {
            accessorKey: "type",
            header: "Blog type"
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div>
                    {
                        row.original.status === true ?
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                            <span className="text-[#027A48]">Active</span>
                        </div>
                        :
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F2F4F7] rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#667085]"></div>
                            <span className="text-[#344054]">Inactive</span>
                        </div>
                    }
                </div>
            )
        },
        {
            accessorKey: "createdBy",
            header: "Created By"
        },
        {
            accessorKey: "updatedAt",
            header: "Last Updated",
            cell: ({ row }) => (
                <p>{dateFormat(row.original.updatedAt, "mediumDate")}</p>
            )
        },
        {
            accessorKey: "updatedBy",
            header: "Updated By"
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex gap-[10px] items-center">
                   <button  onClick={() => router.push(`/cms/blog/blog_form?blogId=${row.original.id}`)} >
                        <FiEdit className="text-[18px] font-semibold text-gray-500" />
                    </button>
                </div>
            )
        }
    ];

    return(
        <>
            <div className="w-full flex justify-end">
                <div>
                    <DefaultButton
                        label="Create New Blog"
                        size="large"
                        icon={<FiPlus className="text-white text-[16px]" />} 
                        onClick={() => router.push('/cms/blog/blog_form')}
                    />
                </div>
            </div>
            <div className="mt-[25px] bg-white rounded-[20px] w-full">
                <div className="p-[20px]">
                    <span className="text-[16px] font-semibold">All Blogs</span>
                </div>
                {
                    isLoading ?
                    <div className="px-[20px] pb-[20px]">
                        <TableLoader />
                    </div>
                    :
                    (
                        (blogTableData?.length !== 0 ) ?
                        <div className="pb-[20px]">
                            <DataTable data={blogTableData} columns={columns} />
                        </div>
                        :
                        <DefaultEmpty />
                    )
                }
            </div>
        </>
    );
};