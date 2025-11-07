
export default function TextLoander({
    label = 'text'
}: {
    label?: string;
}) {
    return(
        <div className="py-[5px] px-[10px] rounded-[5px] bg-gray-200 animate-pulse duration-100 ease-linear">
            <span className="invisible">{label}</span>
        </div>
    );
}