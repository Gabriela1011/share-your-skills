import React from "react";

interface CardProps {
    title: string,
    description: string,
    icon: React.ReactNode;
}

export default function Card({ title, description, icon }: CardProps)
{
    return (
     <div className="bg-white/60 rounded-xl shadow p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-accent mx-auto flex items-center justify-center text-2xl">
            { icon }
        </div>
        <h3 className="font-semibold text-lg mt-4 text-card-foreground">{ title }</h3>
        <p className="text-card-foreground text-sm mt-2">{ description }</p>
    </div>
    )
}