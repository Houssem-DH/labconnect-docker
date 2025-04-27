import React, { useContext } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const AddMasterThesisModal = ({ onClose, isOpen, user }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        speciality: "",
        student: "",
        year: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("master.thesis.insert", { id: user.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Add Master Thesis"
                            : language === "ar"
                            ? "إضافة أطروحة ماجستير"
                            : "Ajouter une thèse de maîtrise"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">
                                {language === "en"
                                    ? "Title"
                                    : language === "ar"
                                    ? "العنوان"
                                    : "Titre"}
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="speciality">
                                {language === "en"
                                    ? "Speciality"
                                    : language === "ar"
                                    ? "التخصص"
                                    : "Spécialité"}
                            </Label>
                            <Input
                                id="speciality"
                                value={data.speciality}
                                onChange={(e) =>
                                    setData("speciality", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.speciality}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="student">
                                {language === "en"
                                    ? "Student"
                                    : language === "ar"
                                    ? "الطالب"
                                    : "Étudiant"}
                            </Label>
                            <Input
                                id="student"
                                value={data.student}
                                onChange={(e) =>
                                    setData("student", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.student}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="year">
                                {language === "en"
                                    ? "Year"
                                    : language === "ar"
                                    ? "السنة"
                                    : "Année"}
                            </Label>
                            <Input
                                id="year"
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData("year", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.year}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {language === "en"
                                ? "Add Thesis"
                                : language === "ar"
                                ? "أضف الأطروحة"
                                : "Ajouter la thèse"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddMasterThesisModal;
