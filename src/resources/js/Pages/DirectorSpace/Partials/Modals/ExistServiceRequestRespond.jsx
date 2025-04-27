import React, { useState, useContext, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import { Textarea } from "@/Components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const ExistServiceRequestRespond = ({ onClose, isOpen, request }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors } = useForm({
        lab_service_accept_answer: "",
        lab_answer_duration: "",
        lab_answer_requirements: "",
        lab_comments: "",
        contact_message: "",
    });

    const [durationError, setDurationError] = useState(null);

    // Regex pattern for duration validation
    const durationRegex = /^\d{1,2}h\s?\d{1,2}min$/;

    // Validate the lab_answer_duration on each change
    useEffect(() => {
        if (
            data.lab_answer_duration &&
            !durationRegex.test(data.lab_answer_duration)
        ) {
            setDurationError(
                language === "en"
                    ? "Invalid format. Example: 1h 30min"
                    : language === "ar"
                    ? "تنسيق غير صالح. مثال: 1 ساعة 30 دقيقة"
                    : "Format invalide. Exemple : 1h 30min"
            );
        } else {
            setDurationError(null);
        }
    }, [data.lab_answer_duration, language]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // If there are errors, don't submit the form
        if (durationError) return;

        post(route("exist.service.requests.respond.accept", { id: request.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className=" max-w-3xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Accept the Service"
                            : language === "ar"
                            ? "إضافة تقرير عالمي"
                            : "Ajouter un rapport global"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Accept Answer */}
                        <div>
                            <Label htmlFor="lab_service_accept_answer">
                                {language === "en"
                                    ? "Service Acceptance Answer"
                                    : language === "ar"
                                    ? "إجابة قبول الخدمة"
                                    : "Réponse d'acceptation du service"}
                            </Label>
                            <Textarea
                                id="lab_service_accept_answer"
                                value={data.lab_service_accept_answer}
                                onChange={(e) =>
                                    setData(
                                        "lab_service_accept_answer",
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                rows="4"
                            />
                            <InputError
                                message={errors.lab_service_accept_answer}
                                className="mt-2"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <Label htmlFor="lab_answer_duration">
                                {language === "en"
                                    ? "Answer Duration"
                                    : "Durée de réponse"}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="lab_answer_duration"
                                    value={data.lab_answer_duration}
                                    onChange={(e) => {
                                        setData(
                                            "lab_answer_duration",
                                            e.target.value
                                        );
                                    }}
                                    className={`w-full pr-10 ${
                                        durationError ? "border-red-500" : ""
                                    }`}
                                    placeholder="e.g., 1h 30min"
                                />
                                {/* Error message */}
                                {durationError && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {durationError}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <Label htmlFor="lab_answer_requirements">
                                {language === "en"
                                    ? "Answer Requirements"
                                    : "Exigences de réponse"}
                            </Label>
                            <Input
                                id="lab_answer_requirements"
                                value={data.lab_answer_requirements}
                                onChange={(e) =>
                                    setData(
                                        "lab_answer_requirements",
                                        e.target.value
                                    )
                                }
                                className="w-full"
                            />
                            <InputError
                                message={errors.lab_answer_requirements}
                                className="mt-2"
                            />
                        </div>

                        {/* Comments */}
                        <div>
                            <Label htmlFor="lab_comments">
                                {language === "en"
                                    ? "Comments"
                                    : "Commentaires"}
                            </Label>
                            <Textarea
                                id="lab_comments"
                                value={data.lab_comments}
                                onChange={(e) =>
                                    setData("lab_comments", e.target.value)
                                }
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                rows="4"
                            />
                            <InputError
                                message={errors.lab_comments}
                                className="mt-2"
                            />
                        </div>

                        {/* Contact Message */}
                        <div>
                            <Label htmlFor="contact_message">
                                {language === "en"
                                    ? "Contact Message"
                                    : "Message de contact"}
                            </Label>
                            <Textarea
                                id="contact_message"
                                value={data.contact_message}
                                onChange={(e) =>
                                    setData("contact_message", e.target.value)
                                }
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                rows="4"
                            />
                            <InputError
                                message={errors.contact_message}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {language === "en"
                                ? "Accept Service"
                                : language === "ar"
                                ? "قبول الخدمة"
                                : "Accepter le service"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExistServiceRequestRespond;
