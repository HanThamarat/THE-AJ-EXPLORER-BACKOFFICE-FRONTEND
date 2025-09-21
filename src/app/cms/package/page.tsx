"use client"

import DefaultButton from "@/app/components/button/default-button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { useSelector } from "react-redux";
import { packageSelector } from "@/app/store/slice/packageManagement";
import { useRef, useEffect, useState } from "react";
import { getAllPacakges } from "@/app/store/slice/packageManagement";
import DataTable from "@/app/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { packageDataTable } from "@/app/types/package";
import dateFormat from "dateformat";
import TableLoader from "@/app/components/loader/tableLoader";
import { IoEyeOutline } from "react-icons/io5";

export default function UserOverview() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { packages } = useSelector(packageSelector);
    const isFaching = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [packageData, setPackageData] = useState<packageDataTable[] | []>([]);

    const columns: ColumnDef<packageDataTable>[] = [
        {
            accessorKey: "index",
            header: "#",
        },
        {
            accessorKey: "packageName",
            header: "Package Name",
        },
        {
            accessorKey: "packageType",
            header: "Package Type",
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
            accessorKey: "create_by",
            header: "Create By",
        },
        {
            accessorKey: "lastupdated",
            header: "Last Updated",
            cell: ({ row }) => (
                <p>{dateFormat(row.original.lastupdated, "mediumDate")}</p>
            )
        },
        {
            accessorKey: "updated_by",
            header: "Updated By",
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex gap-[10px] items-center">
                    <button  onClick={() => alert(`Edit user ${row.original.packageId}`)} >
                        <IoEyeOutline className="text-[20px] font-bold text-[#535862]" />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        setIsLoading(true);
        const getAllPkg = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getAllPacakges());            
            isFaching.current = false;
        }

        getAllPkg();

        if(packages !== null) setIsLoading(false);

        if(packages?.length !== 0) {
            const pkgsFormat: packageDataTable[] =  packages ? packages?.map((data, key) => ({
                index: key + 1,
                packageId: data.id,
                packageName: data.packageName,
                packageType: data.packageType,
                status: data.status,
                create_by: data.created_by,
                lastupdated: new Date(data.updated_at),
                updated_by: data.updated_by
            })) : [];
            setPackageData(pkgsFormat);         
        }
    }, [dispatch, packages]);


    return(
        <>
            <div className="w-full flex justify-end">
                <div>
                    <DefaultButton
                        label="Create New Package"
                        size="large"
                        icon={<FiPlus className="text-white text-[16px]" />} 
                        onClick={() => router.push('/cms/usermanagement/create')}
                    />
                </div>
            </div>
            <div className="mt-[25px] bg-white rounded-[20px] w-full">
                <div className="p-[20px]">
                    <span className="text-[16px] font-semibold">All Packages</span>
                </div>
                {
                    isLoading ?
                    <div className="px-[20px] pb-[20px]">
                        <TableLoader />
                    </div>
                    :
                    <div className="pb-[20px]">
                        <DataTable data={packageData} columns={columns} globalFilter={false} />
                    </div>
                }
            </div>
        </>
    );
};
