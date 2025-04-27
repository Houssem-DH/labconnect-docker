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

const EditPersonalReportModal = ({ onClose, project, pr }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors } = useForm({
        advancement_state: pr.advancement_state,
        scientific_production: pr.scientific_production,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(
            route("project.member.project.personal.report.edit", {
                id: pr.id,
            }),
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
                            ? "Edit Personal Report"
                            : language === "ar"
                            ? "إضافة تقرير عالمي"
                            : "Ajouter un rapport Personal"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="advancement_state">
                                {language === "en"
                                    ? "Advancement State"
                                    : language === "ar"
                                    ? "حالة التقدم"
                                    : "État d'avancement"}
                            </Label>
                            <Textarea
                                id="advancement_state"
                                value={data.advancement_state}
                                onChange={(e) =>
                                    setData("advancement_state", e.target.value)
                                }
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                rows="4"
                            />
                            <InputError
                                message={errors.advancement_state}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="scientific_production">
                                {language === "en"
                                    ? "Scientific Production"
                                    : language === "ar"
                                    ? "الانتاج العلمي"
                                    : "Production scientifique"}
                            </Label>
                            <Input
                                id="scientific_production"
                                value={data.scientific_production}
                                onChange={(e) =>
                                    setData(
                                        "scientific_production",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.scientific_production}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {language === "en"
                                ? "Edit Report"
                                : language === "ar"
                                ? "أضف التقرير"
                                : "Ajouter le rapport"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditPersonalReportModal;
