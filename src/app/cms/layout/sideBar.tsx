"use client";

import Image from "next/image";
import Logo from "@/app/assets/images/svg/logo.png";
import { FiAlignJustify } from "react-icons/fi";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ChevronDown, ChevronRight, Home, Settings, Users } from "lucide-react";
import { MenuItem } from "@/app/types/menu";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string>("/cms/dashboard");

  // Read cookie only once
  useEffect(() => {
    const sideBarCookie = Cookies.get("sideBar");
    if (sideBarCookie !== undefined) {
      setIsOpen(sideBarCookie.toLowerCase() === "true");
    }
  }, []);

  const handleToggleSidebar = () => {
    const status = !isOpen;
    setIsOpen(status);
    Cookies.set("sideBar", `${status}`);
  };

  const handleNavigate = (path: string) => {
    setActivePath(path);
    router.push(path);
  };

  const toggleSubmenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const menu: MenuItem[] = [
    { label: "Dashboard", icon: <Home />, path: "/cms/dashboard" },
    {
      label: "User Management",
      icon: <Users />,
      subItems: [
        { label: "All Users", path: "/cms/usermanagement" },
        { label: "Add User", path: "/users/add" },
      ],
    },
    {
      label: "Settings",
      icon: <Settings />,
      subItems: [
        { label: "General", path: "/settings/general" },
        { label: "Profile", path: "/settings/profile" },
      ],
    },
  ];

  const isActive = (item: MenuItem) => {
    if (item.path && activePath === item.path) return true;
    if (item.subItems?.some((sub) => sub.path === activePath)) return true;
    return false;
  };

  return (
    <div
      className={`h-screen ${
        isOpen ? "w-[278px]" : "w-[70px]"
      } bg-white transition-all duration-300`}
    >
      <div
        className={`h-[70px] p-[20px] flex ${
          isOpen ? "justify-between" : "justify-center"
        } items-center`}
      >
        {isOpen && <Image src={Logo} alt="Logo" />}
        <button onClick={handleToggleSidebar}>
          <FiAlignJustify className="text-primary text-[24px]" />
        </button>
      </div>

      <ul className={`space-y-2 ${isOpen ? "px-[20px]" : "px-[5px]"} mt-[20px]`}>
        {menu.map((item) => (
          <li key={item.label}>
            {/* Main menu item */}
            <button
              onClick={() =>
                item.subItems
                  ? toggleSubmenu(item.label)
                  : handleNavigate(item.path || "")
              }
              className={`flex items-center ${
                isOpen ? "justify-between" : "justify-center"
              } w-full px-3 py-2 rounded-lg ${
                isActive(item) ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </div>
              {item.subItems && isOpen && (
                openMenu === item.label ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )
              )}
            </button>

            {/* Sub menu */}
            {item.subItems && openMenu === item.label && (
              <ul className={`mt-2 space-y-1 bg-[#F5F5F5] rounded-[10px] p-[5px]`}>
                {item.subItems.map((sub) => (
                  <li key={sub.label}>
                    <button
                      onClick={() => handleNavigate(sub.path)}
                      className={`block w-full px-3 text-left py-[8px] rounded-md text-sm ${
                        activePath === sub.path
                          ? "bg-[#FFFFFF] text-black"
                          : "text-black hover:bg-[#FFFFFF]"
                      }`}
                    >
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
