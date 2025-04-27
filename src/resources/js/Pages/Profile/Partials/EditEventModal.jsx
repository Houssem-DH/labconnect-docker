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
import { Textarea } from "@/Components/ui/textarea";

const AddEventModal = ({ onClose, isOpen, event }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, put, processing, errors } = useForm({
        title: event.title,
        description: event.description,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("event.update", { id: event.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Add Scientific Event"
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
                            <Label htmlFor="description">
                                {language === "en"
                                    ? "Description"
                                    : language === "ar"
                                    ? "التخصص"
                                    : "Spécialité"}
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {language === "en"
                                ? "Add Scientific Event"
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

export default AddEventModal;
