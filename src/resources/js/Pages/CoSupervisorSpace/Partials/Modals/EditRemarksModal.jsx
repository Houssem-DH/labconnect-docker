import React, { useState, useContext } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { LanguageContext } from "@/lib/LanguageContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { FiTrash2, FiPlus } from "react-icons/fi";

const EditThesisModal = ({ onClose, thesis }) => {
    const { language } = useContext(LanguageContext);

    const { data, setData, put, processing, errors } = useForm({
        co_supervisor_remarks: JSON.parse(thesis.co_supervisor_remarks || '[]'),
    });

    const [remarks, setRemarks] = useState(() => {
        return Array.isArray(data.co_supervisor_remarks)
            ? data.co_supervisor_remarks
            : [];
    });

    const handleAddRemark = () => {
        setRemarks([...remarks, ""]);
    };

    const handleRemoveRemark = (index) => {
        const updatedRemarks = [...remarks];
        updatedRemarks.splice(index, 1);
        setRemarks(updatedRemarks);

        const updatedData = [...data.co_supervisor_remarks];
        updatedData.splice(index, 1);
        setData("co_supervisor_remarks", updatedData);
    };

    const handleRemarkChange = (e, index) => {
        const updatedRemarks = [...remarks];
        updatedRemarks[index] = e.target.value;
        setRemarks(updatedRemarks);

        const updatedData = [...data.co_supervisor_remarks];
        updatedData[index] = e.target.value;
        setData("co_supervisor_remarks", updatedData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(
            route("co.supervisor.space.supervisor.remark.edit", { id: thesis.id }),
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
                        <div className="flex justify-between mb-2">
                            <Label htmlFor="supervisor_remarks">
                                {language === "en"
                                    ? "Co Supervisor Remarks"
                                    : language === "ar"
                                    ? "ملاحظات المشرف"
                                    : "Remarques du superviseur"}
                            </Label>
                            <Button
                                type="button"
                                onClick={handleAddRemark}
                                className="flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                {language === "en"
                                    ? "Add Remark"
                                    : language === "ar"
                                    ? "إضافة ملاحظة"
                                    : "Ajouter une remarque"}
                            </Button>
                        </div>
                        {remarks.map((remark, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <Textarea
                                    value={remark}
                                    onChange={(e) =>
                                        handleRemarkChange(e, index)
                                    }
                                    placeholder={
                                        language === "en"
                                            ? "Enter supervisor remark"
                                            : language === "ar"
                                            ? "أدخل ملاحظة المشرف"
                                            : "Entrez la remarque du superviseur"
                                    }
                                    className="mr-2 w-full"
                                    rows="2"
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveRemark(index)}
                                    variant="destructive"
                                    className="flex items-center justify-center"
                                >
                                    <FiTrash2 className="text-white" />
                                </Button>
                            </div>
                        ))}
                        <InputError
                            message={errors.supervisor_remarks}
                            className="mt-2"
                        />
                    </div>

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
