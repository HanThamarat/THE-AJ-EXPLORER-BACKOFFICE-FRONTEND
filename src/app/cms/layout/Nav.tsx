"use client"

import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { FiLogOut } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/app/hook/appDispatch';
import { useSelector } from 'react-redux';
import { userSelector } from '@/app/store/slice/userManagement';
import { getCurrentUserInfo } from '@/app/store/slice/userManagement';

export default function Nav() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userInfo } = useSelector(userSelector);
    const isFaching = useRef(false);
    const [isLoading, setIsloading] = useState(true);

    const handlerLogout = async () => {
        await Cookies.remove('authToken');
        router.push('/');
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
            <button className='flex items-center gap-[5px]' onClick={handlerLogout}>
                <FiLogOut />
                <span>Log Out</span>
            </button>
            ),
        },
    ];

    useEffect(() => {
        setIsloading(true);
        const fecthUserInfo = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getCurrentUserInfo());
            isFaching.current = false;
        };

        fecthUserInfo();

        if (userInfo !== null) setIsloading(false);

        
    }, [dispatch, userInfo]);

    return(
        <div className="w-full h-[70px] bg-white flex justify-between items-center px-[20px]">
            <div>

            </div>
            <Dropdown menu={{ items }} placement="bottom">
                <button className='flex items-center gap-[10px]'>
                    <div className='w-[40px] h-[40px] rounded-full bg-primary flex justify-center items-center'>
                        <span className='font-medium text-[16px] text-white'>AD</span>
                    </div>
                    <div>
                        {
                            isLoading ?
                            <div className='animate-pulse bg-gray-200 rounded-[5px]'><span className='invisible'>Thamarat Laosen</span></div>
                            :
                            <span>{userInfo?.firstName} {userInfo?.lastName}</span>
                        }
                        <div className='h-[2px]'></div>
                        {
                            isLoading ?
                            <div className='animate-pulse bg-gray-200 rounded-[5px]'><span className='invisible'>Administrator</span></div>
                            :
                            <span className='block text-left text-gray-600'>{userInfo?.role?.name}</span>
                        }
                    </div>
                </button>
            </Dropdown>
        </div>
    );
};