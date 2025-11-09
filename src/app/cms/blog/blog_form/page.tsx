"use client"

import DefaultSelector, { SelectorOptionTpye } from "@/app/components/select/default-selector";
import DefaultSwitch from "@/app/components/switch/default-switch";
import { BlogEntitySchema, BlogEntitySchemaType } from "@/app/types/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getAllblogType } from "@/app/store/slice/blogManagement";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { blogSelector } from "@/app/store/slice/blogManagement";
import DefaultInput from "@/app/components/input/default-input";
import FileUploadStateBlog from "./uploadState";
import DefaultOutlineButton from "@/app/components/button/outline-button";
import DefaultButton from "@/app/components/button/default-button";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import("@/app/components/textarea/text-editor"), {
  ssr: false,
});

export default function BlogForm() {

    const dispatch = useAppDispatch();
    const { blogTypes } = useSelector(blogSelector);
    const [blogtypeOption, setBlogTypeOption] = useState<SelectorOptionTpye[]>([]);
    const isFachingBlogType = useRef(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<BlogEntitySchemaType>({ resolver: zodResolver(BlogEntitySchema) });

    const onSubmit: SubmitHandler<BlogEntitySchemaType> = async (data) => {
        console.log(data);
    }

    useEffect(() => {
        const fecthAllblogType = async () => {
            if (isFachingBlogType.current) return;
            isFachingBlogType.current = true;
            await dispatch(getAllblogType());
            isFachingBlogType.current = false;
        }

        blogTypes === null && fecthAllblogType();
        
        if (blogTypes?.length !== 0 && blogTypes !== null) {
            const blogTypesFormatter: SelectorOptionTpye[] = blogTypes.map((data) => ({
                value: data.id,
                label: data.name,
            })); 

            setBlogTypeOption(blogTypesFormatter);
        }

    }, [dispatch, blogTypes]);

    return(
        <>
            <div>
                <span className="text-[20px] font-semibold">Create New Blog</span>
                <p className="block text-gray-600">Please enter form below for create your blog.</p>
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-[15px] rounded-[20px] bg-white p-[20px] grid grid-cols-1 gap-[20px]">
                    <div className="flex items-start gap-3">
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Package type is required" }}
                            render={({ field }) => (
                                <DefaultSwitch 
                                    value={field.value ?? true}
                                    onChange={(e) => field.onChange(Boolean(e))} 
                                />
                            )}
                        />
                        <div>
                            <span className="font-semibold">Active the blog</span>
                            <p className="text-gray-700">The active status indicates that the blog is currently available.</p>
                        </div>
                    </div>
                    <div className="flex justify-between gap-[10px] items-center">
                        <div className="w-[30%]">
                            <Controller
                                name="blogtypeId"
                                control={control}
                                render={({ field }) => (
                                    <DefaultSelector
                                        label="Blog Type *"
                                        placeholder="Select blog type"
                                        option={blogtypeOption}
                                        value={field.value}
                                        onChange={(value) => field.onChange(Number(value))}
                                    />
                                )}
                            />
                            { errors.blogtypeId && <span className='text-red-500'>{errors.blogtypeId.message}</span> }
                        </div>
                        <div className="w-full">
                            <DefaultInput
                                label="Blog name *"
                                placeholder="Enter blog name"
                                {...register("title")}
                            />
                            { errors.title && <span className='text-red-500'>{errors.title.message}</span> }
                        </div>
                    </div>
                    <div className="w-full">
                        <Controller
                            name="thumnbnail"
                            control={control}
                            render={({ field }) => (
                                <FileUploadStateBlog
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        { errors.thumnbnail && <span className='text-red-500'>{errors.thumnbnail.message}</span> }
                    </div>
                    <div className="w-full">
                        <Controller
                            name="descrition"
                            control={control}
                            rules={{ required: "Package type is required" }}
                            render={({ field }) => (
                                <TextEditor
                                label="Description *"
                                    onChange={(value) => field.onChange(value)}
                                    value={field.value}
                                />
                            )}
                        />
                        { errors.descrition && <span className='text-red-500'>{errors.descrition.message}</span> }
                    </div>
                    <div className="flex justify-end mt-[30px] gap-[10px]">
                        <div className="w-[20%]">
                            <DefaultOutlineButton
                                type="button"
                                label="Cancel"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="w-[35%]">
                            <DefaultButton
                                label="Create new blog"
                                type="submit"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};