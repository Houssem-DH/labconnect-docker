import React ,{useState} from "react";
import { FiPlus } from "react-icons/fi";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SupervisorCosupervisorLayout";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import AddThesisModal from "./Partials/Modals/AddThesisModal";

const SupCoSupSection = ({
    phd_thesis_supervisor,
    phd_thesis_cosupervisor,
    auth,
    userRole,
}) => {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <Layout user={auth.user} userRole={userRole}>
            <SpaceLayout>
                <div className="p-6 relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-semibold text-gray-800">
                            PhD Theses
                        </h3>
                        <Button variant="default" onClick={openModal} >
                           
                                <FiPlus className="h-6 w-6" />
                           
                        </Button>
                    </div>

                    {phd_thesis_supervisor ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {phd_thesis_supervisor.map((thesis) => (
                                <Card
                                    key={thesis.id}
                                    className="shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-gray-800">
                                            {thesis.thesis_title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            <strong>Team:</strong>{" "}
                                            {thesis.team.title}
                                        </p>
                                        <p>
                                            <strong>PhD Student:</strong>{" "}
                                            {thesis.student.first_name}{" "}
                                            {thesis.student.last_name}
                                        </p>
                                        <p>
                                            <strong>Supervisor :</strong>{" "}
                                            {thesis.supervisor.first_name}{" "}
                                            {thesis.supervisor.last_name}
                                        </p>
                                        <p>
                                            <strong>Co-Supervisor ID:</strong>{" "}
                                            {thesis.co_supervisor ? <> {thesis.co_supervisor.first_name}{" "}
                                            {thesis.co_supervisor.last_name}</> : ""}
                                           
                                        </p>
                                        <p>
                                            <strong>Keywords:</strong>{" "}
                                            {thesis.keywords}
                                        </p>
                                        <p>
                                            <strong>References:</strong>{" "}
                                            {thesis.references}
                                        </p>
                                        <p>
                                            <strong>Abstract:</strong>{" "}
                                            {thesis.abstract}
                                        </p>
                                        <p>
                                            <strong>Advancement State:</strong>{" "}
                                            {
                                                thesis.advancement_state_percentage
                                            }
                                            %
                                        </p>
                                        <p>
                                            <strong>Description:</strong>{" "}
                                            {
                                                thesis.advancement_state_description
                                            }
                                        </p>
                                        <p>
                                            <strong>Supervisor Remarks:</strong>{" "}
                                            {thesis.supervisor_remarks}
                                        </p>
                                        <p>
                                            <strong>
                                                Co-Supervisor Remarks:
                                            </strong>{" "}
                                            {thesis.co_supervisor_remarks}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No theses available.</p>
                    )}

                    {phd_thesis_cosupervisor ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {phd_thesis_cosupervisor.map((thesis) => (
                                <Card
                                    key={thesis.id}
                                    className="shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-gray-800">
                                            {thesis.thesis_title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            <strong>Team:</strong>{" "}
                                            {thesis.team.title}
                                        </p>
                                        <p>
                                            <strong>PhD Student:</strong>{" "}
                                            {thesis.student.first_name}{" "}
                                            {thesis.student.last_name}
                                        </p>
                                        <p>
                                            <strong>Supervisor :</strong>{" "}
                                            {thesis.supervisor.first_name}{" "}
                                            {thesis.supervisor.last_name}
                                        </p>
                                        <p>
                                            <strong>Co-Supervisor ID:</strong>{" "}
                                            {thesis.co_supervisor ? <> {thesis.co_supervisor.first_name}{" "}
                                            {thesis.co_supervisor.last_name}</> : ""}
                                           
                                        </p>
                                        <p>
                                            <strong>Keywords:</strong>{" "}
                                            {thesis.keywords}
                                        </p>
                                        <p>
                                            <strong>References:</strong>{" "}
                                            {thesis.references}
                                        </p>
                                        <p>
                                            <strong>Abstract:</strong>{" "}
                                            {thesis.abstract}
                                        </p>
                                        <p>
                                            <strong>Advancement State:</strong>{" "}
                                            {
                                                thesis.advancement_state_percentage
                                            }
                                            %
                                        </p>
                                        <p>
                                            <strong>Description:</strong>{" "}
                                            {
                                                thesis.advancement_state_description
                                            }
                                        </p>
                                        <p>
                                            <strong>Supervisor Remarks:</strong>{" "}
                                            {thesis.supervisor_remarks}
                                        </p>
                                        <p>
                                            <strong>
                                                Co-Supervisor Remarks:
                                            </strong>{" "}
                                            {thesis.co_supervisor_remarks}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No theses available.</p>
                    )}
                </div>
            </SpaceLayout>
            {/* Modals */}
            <AddThesisModal
                isOpen={showModal}
                onClose={closeModal}
               
            />
        </Layout>
    );
};

export default SupCoSupSection;
