import React, { useContext, useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";
import Layout from "@/Layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import ServiceRequestRespond from "./Partials/Modals/ServiceRequestRespond";
import ExistServiceRequestRespond from "./Partials/Modals/ExistServiceRequestRespond";
import { useForm } from "@inertiajs/react";

const ServiceRequests = ({
  auth,
  notifications,
  exist_service_requests,
  service_requests,
}) => {
  const { language } = useContext(LanguageContext);
  const [filter, setFilter] = useState("all");

  // Filter logic
  const filteredRequests = filter === "exist"
    ? exist_service_requests
    : filter === "regular"
      ? service_requests
      : [...exist_service_requests, ...service_requests];

  // Format date function
  const formatDate = (date) => new Date(date).toLocaleDateString();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedExistService, setSelectedExistService] = useState(null);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [showExistRespondModal, setShowExistRespondModal] = useState(false);

  const openRespondModal = (request) => {
    setSelectedService(request);
    setShowRespondModal(true);
  };

  const closeRespondModal = () => {
    setSelectedService(null);
    setShowRespondModal(false);
  };

  const openExistRespondModal = (request) => {
    setSelectedExistService(request);
    setShowExistRespondModal(true);
  };

  const closeExistRespondModal = () => {
    setSelectedExistService(null);
    setShowExistRespondModal(false);
  };

  const { post, processing, errors } = useForm({});

  const handleAcceptRequest = (request) => {
    if (exist_service_requests.includes(request)) {
      openExistRespondModal(request);
    } else {
      openRespondModal(request);
    }
  };

  const handleRejectRequest = (request) => {
    const routeName = exist_service_requests.includes(request)
      ? "exist.service.requests.respond.reject"
      : "service.requests.respond.reject";

    post(route(routeName, { id: request.id }));
  };

  const isRequestPending = (request) => {
    if (typeof request.request === "string") {
      return request.request === "pending";
    }
    return typeof request.request === "object" && request.request !== null
      ? Object.values(request.request).includes("pending")
      : false;
  };

  return (
    <Layout
      user={auth.user}
      notifications={notifications.list}
      notifications_count={notifications.count}
    >
      <Head title="Service Requests" />
      <div className="py-32 px-8 lg:px-16 flex flex-col items-center">
        {/* Title and Filter Buttons */}
        <div className="flex flex-col items-center mb-8 space-y-4">
          <h1 className="text-4xl font-extrabold text-center text-gray-800">
            {language === "en" ? "Service Requests" : language === "ar" ? "طلبات الخدمة" : "Demandes de service"}
          </h1>
          {/* Filter Buttons */}
          <div className="flex space-x-4">
            {["all", "exist", "regular"].map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => setFilter(type)}
                className={`${filter === type ? "bg-gray-300" : ""} py-2 px-4 rounded-lg transition duration-200`}
              >
                {type === "all"
                  ? "All"
                  : type === "exist"
                    ? "Exist Service Requests"
                    : "Service Requests"}
              </Button>
            ))}
          </div>
        </div>

        {/* Display Requests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredRequests.map((request, index) => (
            <Card
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              <CardHeader className="mb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {request.title || request.service_name || "Service Request"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p><strong>Applicant Type:</strong> {request.applicant_type || "N/A"}</p>
                  <p><strong>Contact Phone:</strong> {request.applicant_tlp || "N/A"}</p>
                  <p><strong>Email:</strong> {request.applicant_adresse_email || "N/A"}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Request Date:</strong> {request.request_date ? formatDate(request.request_date) : "N/A"}</p>
                  <p><strong>Required By:</strong> {request.required_by ? formatDate(request.required_by) : "N/A"}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Details:</strong> {request.description || request.comments || "No details provided."}</p>
                  <p><strong>Request Status:</strong> {request.lab_service_accept_answer || "Pending"}</p>
                  <p><strong>Requirements:</strong> {request.lab_answer_requirements || "None specified."}</p>
                </div>

                {/* Action Buttons */}
                {isRequestPending(request) && (
                  <div className="flex space-x-4 mt-4">
                    <Button
                      onClick={() => handleAcceptRequest(request)}
                      className="bg-green-600 text-white hover:bg-green-700 transition duration-300 px-4 py-2 rounded-lg"
                    >
                      {language === "en" ? "Accept" : "قبول"}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-red-600 text-white hover:bg-red-700 transition duration-300 px-4 py-2 rounded-lg"
                        >
                          {language === "en" ? "Reject" : "رفض"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{language === "en" ? "Are you sure?" : "هل أنت متأكد؟"}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {language === "en" ? "Rejecting this request cannot be undone." : "لا يمكن التراجع عن هذا الإجراء."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{language === "en" ? "Cancel" : "إلغاء"}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRejectRequest(request)}
                            className="bg-red-700 text-white hover:bg-red-800 transition duration-300"
                          >
                            {language === "en" ? "Reject" : "رفض"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modals */}
        {showRespondModal && selectedService && (
          <ServiceRequestRespond
            request={selectedService}
            isOpen={showRespondModal}
            onClose={closeRespondModal}
          />
        )}
        {showExistRespondModal && selectedExistService && (
          <ExistServiceRequestRespond
            request={selectedExistService}
            isOpen={showExistRespondModal}
            onClose={closeExistRespondModal}
          />
        )}
      </div>
    </Layout>
  );
};

export default ServiceRequests;
