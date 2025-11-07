import Image from "next/image";
import { Users, Settings } from "lucide-react";
import { MenuItem } from "@/app/types/menu";

// Icons
import Luggage from "@/app/assets/images/svg/luggage.svg";
import dashboard from "@/app/assets/images/svg/bar-chart-square.svg";
import booking from "@/app/assets/images/svg/booking.svg";

export const menu: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <Image src={dashboard} alt="" />,
    path: "/cms/dashboard",
  },
  {
    label: "Booking",
    icon: <Image src={booking} alt="" />,
    subItems: [
      { label: "Booking", path: "/settings/general" },
      { label: "Cancel", path: "/settings/profile" },
      { label: "Refund", path: "/settings/profile" },
    ],
  },
  {
    label: "Package",
    icon: <Image src={Luggage} alt="" />,
    subItems: [
      { label: "Package", path: "/cms/package" },
      { label: "Package Promotion", path: "/cms/package-promotion" },
      { label: "Package Type", path: "/cms/package_type" },
    ],
  },
  {
    label: "User Management",
    icon: <Users />,
    subItems: [
      { label: "All Users", path: "/cms/usermanagement" },
      { label: "Add User", path: "/cms/usermanagement/add" },
    ],
  },
];
