"use client"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function RoleSelector() {
    const [selectedRole, setSelectedRole] = useState(""); 

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-medium">
                Select Role
            </label>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-white/80 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                        {
                            selectedRole === "student"
                            ? "Student"
                            : selectedRole === "teacher"
                            ? "Teacher"
                            : "Press to select your role"
                        }
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full bg-white/90 shadow-md border border-border rounded-md text-sm">
                    <DropdownMenuRadioGroup value={selectedRole} onValueChange={setSelectedRole}>

                        <DropdownMenuRadioItem 
                            value="student"  
                            className="hover:bg-accent hover:text-accent-foreground  py-2 cursor-pointer"
                        >
                            Student
                        </DropdownMenuRadioItem>

                        <DropdownMenuRadioItem 
                            value="teacher"
                            className="hover:bg-accent hover:text-accent-foreground py-2 cursor-pointer"
                        >
                            Teacher
                        
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>

            </DropdownMenu>
            
            {/*Acest input e trimis odata cu formularul */}
                <input type="hidden" name="role" value={selectedRole} />
        </div>
    )
}