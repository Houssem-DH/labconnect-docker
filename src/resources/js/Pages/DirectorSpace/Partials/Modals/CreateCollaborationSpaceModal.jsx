import { Input } from "@/Components/ui/input";
import React, { useState, useContext } from "react";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
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
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import { FiTrash2, FiPlus } from "react-icons/fi";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";

const AddLabMemberModal = ({ onClose, isOpen, labs, lab }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors, reset } = useForm({
        labs_id: [],
        type: "",
        title: "",
        abstract: "",
       
    });

    const [labInputs, setLabInputs] = useState([]);
    const [openLabs, setOpenLabs] = useState([]);

    const handleAddLab = () => {
        setLabInputs([...labInputs, ""]);
        setOpenLabs([...openLabs, false]);
    };

    const handleRemoveLab = (index) => {
        const updatedLabInputs = [...labInputs];
        updatedLabInputs.splice(index, 1);
        setLabInputs(updatedLabInputs);

        const updatedOpenLabs = [...openLabs];
        updatedOpenLabs.splice(index, 1);
        setOpenLabs(updatedOpenLabs);

        const updatedLabs = [...data.labs_id];
        updatedLabs.splice(index, 1);
        setData("labs_id", updatedLabs);
    };

    const handleLabChange = (labId, labTitle, index) => {
        const updatedLabInputs = [...labInputs];
        updatedLabInputs[index] = labTitle;
        setLabInputs(updatedLabInputs);

        const updatedLabs = [...data.labs_id];
        updatedLabs[index] = labId;
        setData("labs_id", updatedLabs);
    };

    const toggleLabDropdown = (index, isOpen) => {
        const updatedOpenLabs = [...openLabs];
        updatedOpenLabs[index] = isOpen;
        setOpenLabs(updatedOpenLabs);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("lab.collab.space.insert", { id: lab.id }), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>Create Project Collab Request</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            <div className="mt-4 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="labs">Labs:</Label>
                                    <Button
                                        type="button"
                                        onClick={handleAddLab}
                                        variant="outline"
                                        className="flex items-center"
                                    >
                                        <FiPlus className="mr-2" />
                                        Add Lab
                                    </Button>
                                </div>
                                <div>
                                    <table className="w-full">
                                        <tbody>
                                            {labInputs.map((lab, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-gray-200"
                                                >
                                                    <td className="py-2">
                                                        <Popover
                                                            open={openLabs[index]}
                                                            onOpenChange={(isOpen) => toggleLabDropdown(index, isOpen)}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={openLabs[index]}
                                                                    className="w-full justify-between"
                                                                >
                                                                    {labInputs[index] || "Select Lab..."}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Search lab..." />
                                                                    <CommandEmpty>
                                                                        No Lab found.
                                                                    </CommandEmpty>
                                                                    <CommandGroup>
                                                                        {labs.map((lab) => (
                                                                            <CommandItem
                                                                                key={lab.id}
                                                                                value={lab.id}
                                                                                onSelect={() => {
                                                                                    handleLabChange(
                                                                                        lab.id,
                                                                                        lab.title,
                                                                                        index
                                                                                    );
                                                                                    toggleLabDropdown(
                                                                                        index,
                                                                                        false
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        labInputs[index] ===
                                                                                            lab.title
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {lab.title}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveLab(
                                                                    index
                                                                )
                                                            }
                                                            variant="ghost"
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <FiTrash2 />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <InputError
                                        message={errors.labs_id}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <Label htmlFor="type">
                                {language === "en"
                                    ? "Type *"
                                    : language === "ar"
                                    ? "نوع"
                                    : "Type *"}
                            </Label>
                            <Input
                                type="text"
                                id="type"
                                name="type"
                                value={data.type}
                                autoComplete="type"
                                placeholder={
                                    language === "en"
                                        ? "Type"
                                        : language === "ar"
                                        ? "نوع"
                                        : "Type"
                                }
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.type} />

                            <Label htmlFor="title">
                                {language === "en"
                                    ? "Title *"
                                    : language === "ar"
                                    ? "عنوان"
                                    : "Titre *"}
                            </Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={data.title}
                                autoComplete="title"
                                placeholder={
                                    language === "en"
                                        ? "Title"
                                        : language === "ar"
                                        ? "عنوان"
                                        : "Titre"
                                }
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            <InputError message={errors.title} />

                            <Label htmlFor="abstract">
                                {language === "en"
                                    ? "Abstract"
                                    : language === "ar"
                                    ? "خلاصة"
                                    : "Résumé"}
                            </Label>
                            <Textarea
                                id="abstract"
                                name="abstract"
                                value={data.abstract}
                                autoComplete="abstract"
                                placeholder={
                                    language === "en"
                                        ? "Abstract"
                                        : language === "ar"
                                        ? "خلاصة"
                                        : "Résumé"
                                }
                                onChange={(e) =>
                                    setData("abstract", e.target.value)
                                }
                            />
                            <InputError message={errors.abstract} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-white"
                            disabled={processing}
                        >
                            {language === "en"
                                ? "Create Project Collab"
                                : language === "ar"
                                ? "انشاء الحساب"
                                : "Inscrivez-vous"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddLabMemberModal;
