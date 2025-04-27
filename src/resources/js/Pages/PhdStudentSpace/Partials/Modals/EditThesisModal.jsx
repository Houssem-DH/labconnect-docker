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
    console.log(thesis);

    // Using Inertia's form hook
    const { data, setData, put, processing, errors } = useForm({
        thesis_title: thesis.thesis_title || "",
        keywords: thesis.keywords || "",
        references: thesis.references || "",
        abstract: thesis.abstract || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(
            route("phd.student.space.phd.thesis.edit", { id: thesis.id }),
            {
                onSuccess: () => onClose(),
            }
        );
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
