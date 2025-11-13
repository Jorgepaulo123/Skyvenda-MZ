import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PROVINCIAS } from "../../data/consts";
import { Link } from "react-router-dom";
import { FiMapPin,FiChevronDown } from "react-icons/fi";
export function ProvinceDropdown() {
  return (
    <DropdownMenu className='mx-z-index'>
      <DropdownMenuTrigger className="hover:bg-white/50 rounded-full flex items-center justify-center w-[230px] gap-2 px-4 py-2">
        <FiMapPin className="h-4 w-4" />
        <span className="font-extrabold text-gray-600">Da Sua Provincia</span>
        <FiChevronDown className="h-4 w-4 ml-auto text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[230px]">
        {PROVINCIAS.map((province) => (
          <DropdownMenuItem key={province} asChild>
            <Link 
              to={`/p/${province.toLowerCase()}`}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-indigo-500" />
              <span className="text-indigo-500">{province}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}