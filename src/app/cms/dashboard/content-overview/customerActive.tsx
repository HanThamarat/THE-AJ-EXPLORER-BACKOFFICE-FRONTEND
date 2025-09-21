
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";

export default function CustomerActiveComponent() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET);

        socket.on("activeUsers", (data) => {
            setCount(data.count);
        });

        return () => {
            socket.disconnect();
        }
    }, []);
    return(
        <div className="w-full bg-white flex justify-between items-center p-[10px] rounded-[20px]">
            <div>
                <span className="text-gray-400 text-[14px]">Customer Active</span>
                <span className="block font-medium text-[14px]">{count}</span>
            </div>
            <div className="rounded-[10px] p-[10px] bg-primary">
                <LuUsers className="text-white text-[24px]" />
            </div>
        </div>
    );
};