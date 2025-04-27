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

const AddTeachingExperienceModal = ({ isOpen, onClose, user }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors } = useForm({
        module: "",
        speciality: "",
        level: "",
        year: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("teaching.insert", { id: user.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Add Teaching Experience"
                            : language === "ar"
                            ? "إضافة خبرة تدريس"
                            : "Ajouter une expérience d'enseignement"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="module">
                                {language === "en"
                                    ? "Module"
                                    : language === "ar"
                                    ? "وحدة"
                                    : "Module"}
                            </Label>
                            <Input
                                id="module"
                                value={data.module}
                                onChange={(e) =>
                                    setData("module", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.module}
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
                            <Label htmlFor="level">
                                {language === "en"
                                    ? "Level"
                                    : language === "ar"
                                    ? "المستوى"
                                    : "Niveau"}
                            </Label>
                            <Input
                                id="level"
                                value={data.level}
                                onChange={(e) =>
                                    setData("level", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.level}
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
                                type="number"
                                id="year"
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
                                ? "Add Experience"
                                : language === "ar"
                                ? "أضف الخبرة"
                                : "Ajouter l'expérience"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTeachingExperienceModal;
