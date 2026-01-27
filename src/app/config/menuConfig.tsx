import Image from "next/image";
import { Users, Settings } from "lucide-react";
import { MenuItem } from "@/app/types/menu";

// Icons
import Luggage from "@/app/assets/images/svg/luggage.svg";
import dashboard from "@/app/assets/images/svg/bar-chart-square.svg";
import booking from "@/app/assets/images/svg/booking.svg";
import compass from "@/app/assets/images/svg/compass.svg";
import inbox from "@/app/assets/images/svg/inbox.svg";

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
      { label: "Booking", path: "/cms/booking" },
      { label: "Cancel", path: "/cms/cancel" },
      { label: "Refund", path: "/cms/refund" },
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
  {
    label: "Blog",
    icon: <Image src={compass} alt="" />,
    path: "/cms/blog",
  },
  {
    label: "Contact us",
    icon: <Image src={inbox} alt="" />,
    path: "/cms/contact",
  }
];
