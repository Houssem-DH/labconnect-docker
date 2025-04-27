import React, { useState, useContext } from "react";
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

const EditThesisModal = ({ onClose, thesis }) => {
    const { language } = useContext(LanguageContext);

    // Using Inertia's form hook
    const { data, setData, put, processing, errors } = useForm({
        thesis_title: thesis.thesis_title || "",
        keywords: thesis.keywords || "",
        references: thesis.references || "",
        abstract: thesis.abstract || "",
        advancement_state_percentage: thesis.advancement_state_percentage || "",
        advancement_state_description: thesis.advancement_state_description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("co.supervisor.space.phd.thesis.edit", { id: thesis.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Edit PhD Thesis"
                            : language === "ar"
                            ? "تعديل الأطروحة"
                            : "Modifier la thèse"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Thesis Title */}
                        <div>
                            <Label htmlFor="thesis_title">
                                {language === "en"
                                    ? "Thesis Title"
                                    : language === "ar"
                                    ? "عنوان الأطروحة"
                                    : "Titre de la thèse"}
                            </Label>
                            <Input
                                id="thesis_title"
                                value={data.thesis_title}
                                onChange={(e) =>
                                    setData("thesis_title", e.target.value)
                                }
                                required
                                className="w-full"
                            />
                            <InputError
                                message={errors.thesis_title}
                                className="mt-2"
                            />
                        </div>

                        {/* Keywords */}
                        <div>
                            <Label htmlFor="keywords">
                                {language === "en"
                                    ? "Keywords"
                                    : language === "ar"
                                    ? "الكلمات المفتاحية"
                                    : "Mots-clés"}
                            </Label>
                            <Input
                                id="keywords"
                                value={data.keywords}
                                onChange={(e) =>
                                    setData("keywords", e.target.value)
                                }
                                required
                                className="w-full"
                            />
                            <InputError
                                message={errors.keywords}
                                className="mt-2"
                            />
                        </div>

                        {/* References */}
                        <div>
                            <Label htmlFor="references">
                                {language === "en"
                                    ? "References"
                                    : language === "ar"
                                    ? "المراجع"
                                    : "Références"}
                            </Label>
                            <Input
                                id="references"
                                value={data.references}
                                onChange={(e) =>
                                    setData("references", e.target.value)
                                }
                                required
                                className="w-full"
                            />
                            <InputError
                                message={errors.references}
                                className="mt-2"
                            />
                        </div>

                        {/* Abstract */}
                        <div>
                            <Label htmlFor="abstract">
                                {language === "en"
                                    ? "Abstract"
                                    : language === "ar"
                                    ? "ملخص"
                                    : "Résumé"}
                            </Label>
                            <Textarea
                                id="abstract"
                                value={data.abstract}
                                onChange={(e) =>
                                    setData("abstract", e.target.value)
                                }
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                rows="4"
                            />
                            <InputError
                                message={errors.abstract}
                                className="mt-2"
                            />
                        </div>

                        {/* Advancement State Percentage */}
                        <div>
                            <Label htmlFor="advancement_state_percentage">
                                {language === "en"
                                    ? "Advancement State Percentage"
                                    : language === "ar"
                                    ? "نسبة تقدم الأطروحة"
                                    : "Pourcentage d'avancement"}
                            </Label>
                            <Input
                                id="advancement_state_percentage"
                                type="number"
                                min={0}
                                max={100}
                                value={data.advancement_state_percentage}
                                onChange={(e) =>
                                    setData(
                                        "advancement_state_percentage",
                                        Math.max(0, Math.min(100, e.target.value)) // Ensure value is between 0 and 100
                                    )
                                }
                                required
                                className="w-full"
                            />
                            <InputError
                                message={errors.advancement_state_percentage}
                                className="mt-2"
                            />
                        </div>

                        {/* Advancement State Description */}
                        <div>
                            <Label htmlFor="advancement_state_description">
                                {language === "en"
                                    ? "Advancement State Description"
                                    : language === "ar"
                                    ? "وصف تقدم الأطروحة"
                                    : "Description de l'avancement"}
                            </Label>
                            <Textarea
                                id="advancement_state_description"
                                value={data.advancement_state_description}
                                onChange={(e) =>
                                    setData(
                                        "advancement_state_description",
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                rows="4"
                            />
                            <InputError
                                message={errors.advancement_state_description}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {language === "en"
                                ? "Edit Thesis"
                                : language === "ar"
                                ? "تعديل الأطروحة"
                                : "Modifier la thèse"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditThesisModal;
