import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import { title } from "process";
import { buttonVariants } from "../ui/button";

interface iAppProps {
    title: string;
    description: string;
    buttonTxet: string;
    href: string;
}

export function EmptyState({title, description, buttonTxet, href}: iAppProps) {
    return (
        <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-50">
            <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
                <Ban className="size-10 text-destructive" />
            </div>
            <h2 className="mt-6 text-6xl font-semibold">{title}</h2>
            <p className="mb-8 mt-2 text-center text-sm leading-tight"> 
                {description}
            </p>

            <Link
                href={href}
                className={buttonVariants()}
            >
                <PlusCircle className="size-4 mr-2"/>
                <samp>{buttonTxet}</samp>
            </Link>
        </div>
    )
}