
"use client"

import DefaultSelector, { SelectorOptionTpye } from "@/app/components/select/default-selector";
import DefaultSwitch from "@/app/components/switch/default-switch";
import { blogDTO, BlogEntitySchema, BlogEntitySchemaType } from "@/app/types/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { BlogputProps, blogSelector, createNewBlog, getAllblogType, getBlogByid, updatingBlog } from "@/app/store/slice/blogManagement";
import DefaultInput from "@/app/components/input/default-input";
import FileUploadStateBlog from "./uploadState";
import DefaultOutlineButton from "@/app/components/button/outline-button";
import DefaultButton from "@/app/components/button/default-button";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ConfirmModal } from "@/app/components/modal/default-modal";
import notify from "@/app/components/alert/toastify";
import { useSearchParams } from "next/navigation";

const TextEditor = dynamic(() => import("@/app/components/textarea/text-editor"), {
  ssr: false,
});

export default function BlogForm() {

    const dispatch = useAppDispatch();
    const { blogTypes, blogById } = useSelector(blogSelector);
    const [blogtypeOption, setBlogTypeOption] = useState<SelectorOptionTpye[]>([]);
    const [blogData, setBlogData] = useState<blogDTO>();
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
    const isFachingBlogType = useRef(false);
    const isFachingBlog = useRef(false);
    const router = useRouter();
    const searchParam = useSearchParams();
    const blogId = searchParam.get('blogId');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<BlogEntitySchemaType>({ resolver: zodResolver(BlogEntitySchema) });    

    const onSubmit: SubmitHandler<BlogEntitySchemaType> = async (data) => {
        setBlogData({
            title: data.title,
            thumnbnail: {
                id: data.thumnbnail[0].id,
                base64: data.thumnbnail[0].base64,
                fileName: data.thumnbnail[0]?.fileName ?? "unknow.png",
                mainFile: data.thumnbnail[0].mainFile
            },
            descrition: data.descrition,
            status: data.status,
            blogType: data.blogtypeId as number
        });
        setIsOpenConfirmModal(true);
    }

    const onInvalid = (errors: any) => {
        console.log("❌ Validation errors:", errors);
    };

    const handlerConfirm = async () => {
        try {
            let blogPutData: BlogputProps = {
                id: 0,
                blog: undefined
            };
            
            if (blogId !== null) {
                blogPutData = {
                    id: Number(blogId),
                    blog: blogData,
                }
            }
            
            const response: any = blogId !== null ? await dispatch(updatingBlog(blogPutData)) : await dispatch(createNewBlog(blogData));
        
            if (response.payload.status) {
                await reset({
                    status: true,
                    thumnbnail: [],
                    title: "",
                    descrition: "",
                    blogtypeId: null,
                });
                setIsOpenConfirmModal(false);
                notify({
                    type: 'success',
                    label: blogId !== null ? "Updating Blog Successfully" : "Creating Blog Successfully!"
                });
                router.push("/cms/blog");
            } else {
                throw response?.payload?.error ?  response?.payload?.error : "Createing package something wrong.";
            }
        } catch (error) {
            notify({
                type: 'error',
                label: error as string
            });
        }
    }

    useEffect(() => {
        if (blogId === null) {
            reset({
                status: true,
            });
            setIsLoading(false);
        } 
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

    useEffect(() => {
        const fecthBlogById = async () => {
            if (isFachingBlog.current) return;
            isFachingBlog.current = true;
            await dispatch(getBlogByid(Number(blogId)));
            isFachingBlog.current = false;
        }
        

        if (blogId !== null) {
            fecthBlogById();
        
            if (blogById !== null) { 
                reset({
                    title: blogById.title,
                    thumnbnail: [
                        {
                            id: blogById.thumnbnail?.file_name,
                            base64: blogById.thumnbnail.base64,
                            fileName: blogById.thumnbnail.file_original_name,
                            mainFile: blogById.thumnbnail.mainFile
                        },
                    ],
                    descrition: blogById.descrition,
                    status: blogById.status,
                    blogtypeId: blogById.blogtype_id as number
                });
                setIsLoading(false);
            }
        }
    }, [blogId, dispatch, blogById]);

    return(
        <>
            <ConfirmModal    
                title={ blogId !== null ? "Do you want to Update Blog ?" : "Do you want to Create Blog ?" } 
                description={ blogById !== null ? "Confirm to proceed with update this blog." : "Confirm to proceed with creation this blog." }
                open={isOpenConfirmModal}
                cancalFunc={() => setIsOpenConfirmModal(false)}
                confirmFunc={handlerConfirm}
            />
            <div>
                <span className="text-[20px] font-semibold">{ blogId ? "Update New Blog" : "Create New Blog" }</span>
                <p className="block text-gray-600">Please enter form below for create your blog.</p>
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmit, onInvalid)}>
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
                    {
                        isLoading === false ?
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
                        :
                        <></>
                    }
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
                                label={ blogId !== null ? "Update new blog" :  "Create new blog" }
                                type="submit"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};