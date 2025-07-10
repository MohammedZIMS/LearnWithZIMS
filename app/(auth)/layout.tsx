import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/public/Logo.png"

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link href="/" className={buttonVariants({
                variant: "outline",
                className: "absolute top-4 left-4"
            })}>
                <ArrowLeft className="size-4" />
                Back
            </Link>

            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-1 self-center font-medium">
                    <Image src={Logo} alt="Logo" width={40} height={40} />
                    Learn With ZIMS
                </Link>
                {children}

                <p className="text-balance text-center text-xs">
                    By continuing, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="hover:underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="hover:underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}