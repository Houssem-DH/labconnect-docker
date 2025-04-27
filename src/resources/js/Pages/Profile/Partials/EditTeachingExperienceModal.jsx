import React, { useContext, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";

const EditTeachingExperienceModal = ({ onClose,isOpen, teaching }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, put, processing, errors } = useForm({
        module: teaching.module,
        speciality: teaching.speciality,
        level: teaching.level,
        year: teaching.year,
    });

    

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("teaching.update", { id: teaching.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Edit Teaching Experience"
                            : language === "ar"
                            ? "تحرير خبرة التدريس"
                            : "Modifier l'expérience d'enseignement"}
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
                            <InputError message={errors.module} className="mt-2" />
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
                            <InputError message={errors.speciality} className="mt-2" />
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
                            <InputError message={errors.level} className="mt-2" />
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
                                value={data.year}
                                onChange={(e) => setData("year", e.target.value)}
                                required
                            />
                            <InputError message={errors.year} className="mt-2" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {language === "en"
                                ? "Save Changes"
                                : language === "ar"
                                ? "احفظ التغييرات"
                                : "Sauvegarder les modifications"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTeachingExperienceModal;
