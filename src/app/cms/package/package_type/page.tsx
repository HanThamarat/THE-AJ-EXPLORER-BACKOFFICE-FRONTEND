"use client"

import PkgTypeModal from "./modal/packageTypeModal";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { pkgTypeSelector } from "@/app/store/slice/pkgTypeManangementSlice";
import { getAllPkgType } from "@/app/store/slice/pkgTypeManangementSlice";
import TableLoader from "@/app/components/loader/tableLoader";
import DataTable from "@/app/components/table/dataTable";
import DefaultEmpty from "@/app/components/empty/default-emtpy";
import { packageTypeDataTable, packageTypeEntity } from "@/app/types/package";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { IoEyeOutline } from "react-icons/io5";
import DelPkgTypeModal from "./modal/delPkgTypeModal";


export default function PackageTypePage({}) {

    const dispatch = useAppDispatch();
    const { pkgTypes } = useSelector(pkgTypeSelector);
    const isFaching = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pkgTypesData, setpkgTypesData] = useState<packageTypeDataTable[] | []>([]);

    const columns: ColumnDef<packageTypeDataTable>[] = [
        {
            accessorKey: "index",
            header: "#",
        },
        {
            accessorKey: "name",
            header: "Name"
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
            accessorKey: "created_by",
            header: "Create By",
        },
        {
            accessorKey: "updated_at",
            header: "Last Updated",
            cell: ({ row }) => (
                <p>{dateFormat(row.original.updated_at, "mediumDate")}</p>
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
                <div className="flex gap-4 items-center">
                    <PkgTypeModal pkgType={row.original as packageTypeEntity} />
                    <DelPkgTypeModal pkgTypeId={row.original.id} />
                </div>
            ),
        },
    ];

    useEffect(() => {
        setIsLoading(true);
        const getPkgTYP = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getAllPkgType());
            isFaching.current = false;
        }

        pkgTypes === null ? getPkgTYP() : setIsLoading(false);

        if (pkgTypes?.length !== 0) {
            const pkgTypeDataFormat: packageTypeDataTable[] = pkgTypes ? pkgTypes.map((data, key) => ({
                index: key + 1,
                id: data.id,
                name: data.name,
                status: data.status,
                created_by: data.created_by,
                created_at: new Date(data.created_at),
                updated_by: data.updated_by,
                updated_at: new Date(data.updated_at)
            })) : [];
            
            setpkgTypesData(pkgTypeDataFormat);
        }
        
    }, [dispatch, pkgTypes]);

    return(
        <>
            <div className="w-full flex justify-end">
                <div>
                    <PkgTypeModal />
                </div>
            </div>
            <div className="bg-white rounded-[20px] w-full mt-[25px]">
                <div className="p-[20px]">
                    <span className="text-[16px] font-semibold">All Pacakge Type</span>
                </div>
                {
                    isLoading ?
                    <div className="px-[20px] pb-[20px]">
                        <TableLoader />
                    </div>
                    :
                    (
                        pkgTypes?.length !== 0 ?
                        <div className="pb-[20px]">
                            <DataTable data={pkgTypesData} columns={columns} />
                        </div>
                        :
                        <DefaultEmpty />
                    )
                }
            </div>
        </>
    );
}