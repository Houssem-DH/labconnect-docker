import React, { useState, useContext, useEffect } from "react";

import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import InputMask from "react-input-mask";

import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Checkbox } from "@/Components/ui/checkbox"; // Assuming you have a Checkbox component in Shadcn UI
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";

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

import { Check, ChevronsUpDown, Search } from "lucide-react";

const AddThesisModal = ({ onClose, isOpen }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors, reset } = useForm({
        thesis_title: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("lab.member.insert", { id: lab.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className=" max-w-3xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>Add New Thesis</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            <Label htmlFor="thesis_title">
                                {" "}
                                {language === "en"
                                    ? "Thesis Tilte *"
                                    : language === "ar"
                                    ? "اللقب"
                                    : "Titre De tese  *"}
                            </Label>
                            <Input
                                type="text"
                                id="thesis_title"
                                name="thesis_title"
                                value={data.thesis_title}
                                autoComplete="thesis_title"
                                placeholder={
                                    language === "en"
                                        ? "Thesis Tilte"
                                        : language === "ar"
                                        ? "اللقب"
                                        : "Thesis Tilte"
                                }
                                onChange={(e) =>
                                    setData("thesis_title", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.thesis_title} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full  text-white "
                            disabled={processing}
                        >
                            {language === "en"
                                ? "Add Thesis"
                                : language === "ar"
                                ? "انشاء الحساب"
                                : "Add Thesis"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddThesisModal;
