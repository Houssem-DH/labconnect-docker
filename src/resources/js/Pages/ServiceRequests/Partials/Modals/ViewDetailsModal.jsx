import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogContent,
  DialogClose,
} from "@/Components/ui/dialog";
import { Info, CheckCircle, XCircle } from "lucide-react";

const ViewDetailsModal = ({ isOpen, onClose, request, language, labs }) => {
  // Helper function to get lab answers
  const getLabAnswer = (answerData, index) => {
    try {
      const answer = JSON.parse(JSON.stringify(answerData))[index];
      return answer ? answer[1] : "N/A"; // Get content from the array, default to "N/A"
    } catch (e) {
      console.error("Error parsing lab answer:", e);
      return "N/A";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="overflow-hidden">
      <DialogContent className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full mx-auto transform transition-all duration-300 ease-in-out  overflow-y-scroll max-h-screen ">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            <Info className="inline-block mr-2" size={20} />
            {language === "en"
              ? "Service Request Details"
              : language === "ar"
              ? "تفاصيل طلب الخدمة"
              : "Détails de la demande de service"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4 text-gray-700">
          <div>
            <p className="text-sm font-medium text-gray-600">
              <strong>
                {language === "en" ? "Title" : language === "ar" ? "العنوان" : "Titre"}:
              </strong>{" "}
              {request.title}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              <strong>
                {language === "en" ? "Description" : language === "ar" ? "الوصف" : "Description"}:
              </strong>{" "}
              {request.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              <strong>
                {language === "en" ? "Applicant Type" : language === "ar" ? "نوع المتقدم" : "Type de demandeur"}:
              </strong>{" "}
              {request.applicant_type}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              <strong>
                {language === "en" ? "Email" : language === "ar" ? "البريد الإلكتروني" : "E-mail"}:
              </strong>{" "}
              {request.applicant_adresse_email || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              <strong>
                {language === "en" ? "Requested By" : language === "ar" ? "تم الطلب من قبل" : "Demandé par"}:
              </strong>{" "}
              {new Date(request.request_date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              <strong>
                {language === "en" ? "Required By" : language === "ar" ? "مطلوب بحلول" : "Requis pour"}:
              </strong>{" "}
              {new Date(request.required_by).toLocaleDateString()}
            </p>
          </div>

          {/* Lab Answers */}
          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-lg text-gray-800">
              <CheckCircle className="inline-block mr-2" size={20} />
              {language === "en"
                ? "Lab Answers"
                : language === "ar"
                ? "إجابات المختبر"
                : "Réponses du laboratoire"}
            </h3>

            {request.lab_answer_title && request.lab_answer_title.length > 0 ? (
              request.lab_answer_title.map((titleData, index) => {
                // Get the lab by ID
                const lab = labs && labs.length > 0 ? labs.find((lab) => lab.id === titleData[0]) : null;

                return (
                  <div key={index} className="space-y-4 border-b pb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>
                          {language === "en" ? "Lab Name" : language === "ar" ? "اسم المختبر" : "Nom du laboratoire"}:
                        </strong>{" "}
                        {lab ? lab.title : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>
                          {language === "en" ? "Answer Title" : language === "ar" ? "عنوان الإجابة" : "Titre de la réponse"}:
                        </strong>{" "}
                        {titleData[1] || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>
                          {language === "en"
                            ? "Accept Answer"
                            : language === "ar"
                            ? "إجابة قبول"
                            : "Réponse d'acceptation"}:
                        </strong>{" "}
                        {getLabAnswer(request.lab_service_accept_answer, index)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>
                          {language === "en" ? "Price" : language === "ar" ? "السعر" : "Prix"}:
                        </strong>{" "}
                        {getLabAnswer(request.lab_answer_price, index)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>
                          {language === "en" ? "Duration" : language === "ar" ? "المدة" : "Durée"}:
                        </strong>{" "}
                        {getLabAnswer(request.lab_answer_duration, index)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>
                          {language === "en" ? "Requirements" : language === "ar" ? "المتطلبات" : "Exigences"}:
                        </strong>{" "}
                        {getLabAnswer(request.lab_answer_requirements, index)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        <strong>
                          {language === "en"
                            ? "Lab Comments"
                            : language === "ar"
                            ? "تعليقات المختبر"
                            : "Commentaires du laboratoire"}:
                        </strong>{" "}
                        {getLabAnswer(request.lab_comments, index)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-600">
                {language === "en" ? "No lab answers available." : language === "ar" ? "لا توجد إجابات من المختبر." : "Pas de réponses de laboratoire."}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
            {language === "en" ? "Close" : language === "ar" ? "إغلاق" : "Fermer"}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsModal;
