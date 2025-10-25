"use client";

import Image from "next/image";
import Logo from "@/app/assets/images/svg/logo.svg";
import { FiAlignJustify } from "react-icons/fi";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ChevronDown, ChevronRight, Settings, Users } from "lucide-react";
import { MenuItem } from "@/app/types/menu";
import { useRouter, usePathname } from "next/navigation";
import { menu } from "@/app/config/menuConfig";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string>(pathname);

  // Read cookie for sidebar open/close state
  useEffect(() => {
    const sideBarCookie = Cookies.get("sideBar");
    if (sideBarCookie !== undefined) {
      setIsOpen(sideBarCookie.toLowerCase() === "true");
    }
  }, []);

  // Update activePath whenever url changes
  useEffect(() => {
    if (pathname) {
      setActivePath(pathname);

      // Auto expand submenu if current path belongs to one
      const parent = menu.find(
        (item) => item.subItems?.some((sub) => sub.path === pathname)
      );
      if (parent) setOpenMenu(parent.label);
    }
  }, [pathname]);

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


  const isActive = (item: MenuItem) => {
    if (item.path && activePath === item.path) return true;
    if (item.subItems?.some((sub) => sub.path === activePath)) return true;
    return false;
  };

  return (
    <div
      className={`h-screen ${
        isOpen ? "xl:w-[278px]" : "w-[70px]"
      } w-[70px] bg-white transition-all duration-300`}
    >
      {/* Header */}
      <div
        className={`h-[70px] p-[20px] flex ${
          isOpen ? "justify-between" : "justify-center"
        } items-center`}
      >
        {isOpen && <Image src={Logo} width={140} className="hidden xl:block" alt="Logo" />}
        <button onClick={handleToggleSidebar}>
          <FiAlignJustify className="text-primary text-[24px]" />
        </button>
      </div>
      <ul className={`space-y-2 ${isOpen ? "xl:px-[20px]" : "px-[5px]"} px-[5px] mt-[20px]`}>
        {menu.map((item) => (
          <li key={item.label}>
            {/* Main menu item */}
            <button
              onClick={() =>
                item.subItems
                  ? toggleSubmenu(item.label)
                  : handleNavigate(item.path || "")
              }
              className={`flex items-center justify-center ${
                isOpen ? "xl:justify-between" : "justify-center"
              } w-full px-3 py-2 rounded-lg duration-100 ease-in-out ${
                isActive(item) ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="flex items-center space-x-0 xl:space-x-2">
                {item.icon}
                {isOpen && <span className="hidden xl:block">{item.label}</span>}
              </div>
              <div className="hidden xl:block">
                {item.subItems && isOpen && (
                  openMenu === item.label ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )
                )}
              </div>
            </button>
            {item.subItems && openMenu === item.label && (
              <ul className="mt-2 space-y-1 bg-[#F5F5F5] rounded-[10px] p-[5px]">
                {item.subItems.map((sub) => (
                  <li key={sub.label}>
                    <button
                      onClick={() => handleNavigate(sub.path)}
                      className={`block w-full px-3 text-left py-[8px] duration-100 ease-in-out rounded-md text-sm ${
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
