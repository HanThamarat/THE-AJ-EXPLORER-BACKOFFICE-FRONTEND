import toast from "react-hot-toast";

interface ToastType {
    label: string;
    type?: "success" | "error" | "warning";
}

const notify = ({ label, type = "success" }: ToastType) => {
    switch (type) {
        case "success":
            return toast.success(label, {
                duration: 5000,
                position: "top-right",
            });
        case "error":
            return toast.error(label, {
                duration: 5000,
                position: "top-right",
            });
        case "warning":
            return toast(label, { // Default toast for warnings (yellow color needs custom styling)
                duration: 5000,
                position: "top-right",
                style: { background: "#facc15", color: "#000" }, // Yellow background for warning
            });
        default:
            return toast(label, { duration: 5000, position: "top-right" });
    }
};

export default notify;