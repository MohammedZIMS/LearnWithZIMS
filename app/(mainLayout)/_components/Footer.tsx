import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Logo.png";
import { SearchBarInput } from "@/components/SeachBar";
import { IconBrandFacebook, IconBrandLinkedin, IconBrandYoutube } from "@tabler/icons-react";

export function FooterSction() {
    return (
        <footer className="border-t mt-16 border-gray-700 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">

                <div>
                    <Link href="/" className="flex items-center space-x-3">
                        <Image
                            src={Logo}
                            alt="Logo"
                            className="h-8 w-8 transition-transform group-hover:scale-110"
                        />
                        <span className="font-bold text-lg tracking-tight">
                            Learn with <span className="text-primary">ZIMS</span>
                        </span>
                    </Link>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Empower your learning journey with interactive courses and expert instructors.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
                        <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashbord</Link></li>
                    </ul>
                </div>

                <div>
                    <h4>Search</h4>
                    <div className="w-44">
                        <SearchBarInput />
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <div className="flex gap-3">
                        <Link href="#" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                            <IconBrandLinkedin />
                        </Link>
                        <Link href="#" aria-label="Facebook" className="hover:text-primary transition-colors">
                            <IconBrandFacebook />
                        </Link>
                        <Link href="#" aria-label="YouTube" className="hover:text-primary transition-colors">
                            <IconBrandYoutube />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Learn with ZIMS. All rights reserved.
            </div>

        </footer>
    )
}