import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import {
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from "react-icons/hi";

export default function LabsPage({ auth, my_labs }) {
    return (
        <Layout user={auth.user}>
            <>
                <Head title="My Labs" />
                <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 font-sans pt-12">
                    <div className="container mx-auto p-4 flex-grow">
                        <h1 className="text-3xl font-semibold mb-8 text-gray-900">
                            My Labs
                        </h1>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-md">
                                <thead className="bg-gray-100 text-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                                            Lab Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                                            Establishment
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                                            Picture
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {my_labs.map((lab) => (
                                        <tr
                                            key={lab.id}
                                            className="hover:bg-gray-50 transition-all duration-300 ease-in-out transform "
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {lab.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {lab.establishment}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                <img
                                                    src={`storage/${lab.picture}`}
                                                    alt={lab.title}
                                                    className="w-16 h-16 object-cover rounded-full"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route(
                                                        "my.labs.manage",
                                                        { id: lab.id }
                                                    )}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        </Layout>
    );
}
