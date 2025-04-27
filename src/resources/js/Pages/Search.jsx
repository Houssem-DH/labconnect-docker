import React, { useContext } from "react";
import { usePage, Head, Link } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";
import Layout from "@/Layouts/Layout";

const SearchResultsPage = ({auth,notifications}) => {
    const { query, labs, services } = usePage().props;
    const { language } = useContext(LanguageContext);

    return (
        <Layout user={auth.user} notifications={notifications.list} notifications_count={notifications.count}>
            <Head title={`Search Results for "${query}"`} />

            {/* Hero Section */}
            <section className="py-32">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">
                        {language === "en" && `Search Results for "${query}"`}
                        {language === "ar" && `نتائج البحث لـ "${query}"`}
                        {language === "fr" && `Résultats de la recherche pour "${query}"`}
                    </h1>
                </div>
            </section>

            {/* Labs Section */}
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8">Labs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {labs.length > 0 ? (
                            labs.map((lab) => (
                                <Link
                                    key={lab.id}
                                    href={`/labs/${lab.id}`}
                                    className="block bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
                                >
                                    <div className="h-48 bg-gray-300">
                                        <img
                                            src={`storage/${lab.picture}`}
                                            alt={lab.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-medium text-gray-800">{lab.title}</h3>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {lab.description || "Learn more about this lab"}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-600">No labs found</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-12">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8">Services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.length > 0 ? (
                            services.map((service) => (
                                <Link
                                    key={service.id}
                                    href={`/labs/${service.lab.id}`}
                                    className="block bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
                                >
                                    <div className="h-48 bg-gray-300">
                                        <img
                                            src={`storage/${service.picture}`}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-medium text-gray-800">{service.title}</h3>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {service.description || "Learn more about this service"}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-600">No services found</p>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default SearchResultsPage;
