import { ReactNode } from "react";
import { Navbar } from "./_components/Navbar";
import { FooterSction } from "./_components/Footer";

export default function LayoutMain({children}: {children: ReactNode}){
    return (
        <div>
            <Navbar/>
            <main>
                {children}
            </main>
            <FooterSction/>
        </div>
    )
}