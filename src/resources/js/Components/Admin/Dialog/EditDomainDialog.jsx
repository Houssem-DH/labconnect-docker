import React, { useState, useContext } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";

import { LanguageContext } from "@/lib/LanguageContext";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";

function EditDomainDialog({ domain, isOpen, onClose }) {
    const { language } = useContext(LanguageContext);

    const { data, setData, put, errors } = useForm({
        name: domain.name,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("dashboard.domain.edit", { id: domain.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Edit Domain"
                            : language === "ar"
                            ? "تعديل المنشأة"
                            : "Modifier Domain"}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            <Label htmlFor="name">
                                {" "}
                                {language === "en"
                                    ? "Enter the name"
                                    : language === "ar"
                                    ? "أدخل الاسم"
                                    : "Entrez le nom"}
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder={
                                    language === "en"
                                        ? "Name"
                                        : language === "ar"
                                        ? "اسم"
                                        : "Nom"
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <Button type="submit" className="w-full text-white">
                            {language === "en"
                                ? "Submit"
                                : language === "ar"
                                ? "تفدم"
                                : "Soumettre"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EditDomainDialog;
