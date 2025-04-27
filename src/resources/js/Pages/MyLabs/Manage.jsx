import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import {
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from "react-icons/hi";

export default function LabsPage({ auth }) {
    return (
        <Layout user={auth.user}>
            <>
                <Head title="Manage" />
                <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 font-sans pt-12">
                    <div className="container mx-auto p-4 flex-grow">
                        <h1 className="text-3xl font-semibold mb-8 text-gray-900">
                           Manage My Lab
                        </h1>
                    </div>
                </div>
            </>
        </Layout>
    );
}
