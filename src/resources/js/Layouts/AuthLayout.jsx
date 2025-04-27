import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="flex flex-col py-12 items-center justify-center min-h-screen bg-white">
            <Link href="/" className="mb-8">
                <ApplicationLogo className="h-16 w-auto fill-current text-gray-500" />
            </Link>
            <div className="w-full max-w-md p-8 shadow-lg rounded-lg">
                {children}
            </div>
        </div>
    );
}
