
export default function ImageLoader() {
    return(
       <div className="w-full grid grid-cols-2 gap-[10px] items-center justify-between">
            <div className="w-full h-full rounded-[10px] bg-gray-200 animate-pulse duration-100 ease-linear">

            </div>
            <div className="w-full grid grid-cols-2 gap-[10px] items-center justify-between">
                <div className="w-full h-[150px] bg-gray-200 animate-pulse duration-100 ease-linear rounded-[10px]"></div>
                <div className="w-full h-[150px] bg-gray-200 animate-pulse duration-100 ease-linear rounded-[10px]"></div>
                <div className="w-full h-[150px] bg-gray-200 animate-pulse duration-100 ease-linear rounded-[10px]"></div>
                <div className="w-full h-[150px] bg-gray-200 animate-pulse duration-100 ease-linear rounded-[10px]"></div>
            </div>
        </div>  
        );
};