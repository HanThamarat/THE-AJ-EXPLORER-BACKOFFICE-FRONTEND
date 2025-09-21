"use client"

import Image from "next/image";
import Logo from '@/app/assets/images/svg/logo-ligth.svg';
import LogoDash from '@/app/assets/images/img/dashboard.png';
import DefaultInput from "./components/input/default-input";
import DefaultButton from "./components/button/default-button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, signInSchemaType } from "@/app/types/auth";
import { useAppDispatch } from "./hook/appDispatch";
import { signIn } from "./store/slice/authManagement";
import { useState } from "react";
import notify from "./components/alert/toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Home() {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);

  const { 
      register,
      handleSubmit,
      formState: { errors }
  } = useForm<signInSchemaType>({ resolver: zodResolver(signinSchema) });

  const onSubmit: SubmitHandler<signInSchemaType> = async (data) => {
    try {
      setIsloading(true);
      const response: any = await dispatch(signIn(data));

      if (response?.payload?.status  === true) {
        await Cookies.set("authToken", response?.payload?.data?.authToken, { expires: 1, secure: true });
        notify({ label: 'sign in successfully!', type: 'success' });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_AUTH_CALLBACK}`;
        }, 2000);
      } else {
        throw `${response?.payload?.error}`;
      }
    } catch (error) {
      setIsloading(false);
      notify({
        label: error as string,
        type: 'error'
      });
      return error;
    }
  }

  return (
    <div className="h-screen flex w-full justify-between">
      <div className="w-1/2 bg-primary p-[20px]">
        <Image src={Logo} width={250} alt="" />
        <div className="h-[80vh] flex justify-center items-center">
          <Image src={LogoDash}  alt="" />
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full px-[40px] xl:px-[70px] md:px-[60px] 2xl:px-[100px] grid grid-cols-1 gap-[20px]">
          <div className="w-full">
            <DefaultInput label="Username" placeholder="Enter your username" {...register("username")} />
            {errors.username && <span>{errors.username.message}</span>} 
          </div>
          <div className="w-full">
            <DefaultInput label="Password" placeholder="Enter your password" {...register("password")} />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <DefaultButton label="Sign In" type="submit" isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
}
