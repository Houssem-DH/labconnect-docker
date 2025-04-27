import Layout from "@/Layouts/CollaborationSpaceLayout";
import React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Link, Head } from "@inertiajs/react";
import { FiArrowRight } from "react-icons/fi";

const PhdThesis = ({
    auth,
    userRole,
    projects_count,
    phd_thesis_count,
    notifications,
 
    collab_phd_thesis = [],
    supervisor_phd_thesis = [],
    co_supervisor_phd_thesis = [],
}) => {
    // Combine PhD thesis arrays into one, ensuring no duplication
    const combinedPhdThesis = [
        ...(collab_phd_thesis || []),
        ...(supervisor_phd_thesis || []),
        ...(co_supervisor_phd_thesis || []),
    ];

    // Use a Map to remove duplicates and assign roles
    const thesisMap = new Map();

    combinedPhdThesis.forEach((thesis) => {
        if (!thesisMap.has(thesis.id)) {
            let role = collab_phd_thesis.includes(thesis)
                ? "collaborator"
                : supervisor_phd_thesis.includes(thesis)
                ? "supervisor"
                : "co-supervisor";

            thesisMap.set(thesis.id, { ...thesis, thesisRole: role });
        } else {
            const existingThesis = thesisMap.get(thesis.id);
            if (supervisor_phd_thesis.includes(thesis)) {
                existingThesis.thesisRole = "supervisor";
            } else if (co_supervisor_phd_thesis.includes(thesis)) {
                existingThesis.thesisRole = "co-supervisor";
            }
            thesisMap.set(thesis.id, existingThesis);
        }
    });

    const phdTheses = Array.from(thesisMap.values());

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            projects_count={projects_count}
            phd_thesis_count={phd_thesis_count}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="PhD Thesis" />

            <div className="p-6 bg-gray-50 rounded-lg shadow-sm mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                    PhD Theses
                </h3>

                {phdTheses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {phdTheses.map((phd) => (
                            <Card
                                key={phd.id}
                                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg"
                            >
                                <CardHeader className="border-b p-4 bg-gray-100 rounded-t-lg">
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        {phd.thesis_title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 text-gray-700">
                                    <div className="mb-3">
                                        <strong>Keywords:</strong>{" "}
                                        {phd.keywords || "No keywords"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>References:</strong>{" "}
                                        {phd.references || "No references"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Advancement State:</strong>{" "}
                                        {phd.advancement_state_description ||
                                            "No state description"}
                                    </div>
                                    <Link
                                        href={`/collaboration-space/phd-thesis/view/${phd.id}`}
                                        className="text-blue-500 hover:underline inline-flex items-center"
                                    >
                                        View Thesis
                                        <FiArrowRight
                                            className="ml-2"
                                            size={16}
                                        />
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600 text-center py-6">
                        No PhD theses found.
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PhdThesis;
