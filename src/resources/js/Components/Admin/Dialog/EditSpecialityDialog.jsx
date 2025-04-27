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

function EditSpecialityDialog({ speciality, domains, isOpen, onClose }) {
    const { language } = useContext(LanguageContext);

    const { data, setData, put, errors } = useForm({
        name: speciality.name,
        domain_id: speciality.domain_id,
    });

    const [openDomain, setOpenDomain] = useState(false); // Change to true to make the dialog initially open
    const [valueDomain, setValueDomain] = useState(speciality.domain_id);
    const [selectedDomain, setSelectedDomain] = useState(
        speciality.domain.name
    );

    const submit = (e) => {
        e.preventDefault();

        put(route("dashboard.speciality.edit", { id: speciality.id }), {
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
                            ? "Edit speciality"
                            : language === "ar"
                            ? "تعديل المنشأة"
                            : "Modifier speciality"}
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

                        <div className="grid gap-4">
                            <Label htmlFor="Domain">
                                {" "}
                                {language === "en"
                                    ? "Enter the Domain"
                                    : language === "ar"
                                    ? "أدخل الاسم"
                                    : "Entrez le Domain"}
                            </Label>
                            <Popover
                                open={openDomain}
                                onOpenChange={setOpenDomain}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openDomain}
                                        className="w-full justify-between"
                                    >
                                        {selectedDomain
                                            ? selectedDomain
                                            : "Select Domain..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0  popover-content-width-full">
                                    <Command>
                                        <CommandInput placeholder="Search Domain..." />
                                        <CommandEmpty>
                                            No Domain found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {domains.map((domain) => (
                                                <CommandItem
                                                    key={domain.id}
                                                    value={domain.id}
                                                    onSelect={() => {
                                                        setValueDomain(
                                                            domain.id
                                                        ); // Set value directly as user id
                                                        setSelectedDomain(
                                                            domain.name
                                                        ); // Set selectedUser with first name and last name
                                                        setData(
                                                            "domain_id",
                                                            domain.id
                                                        ); // Set form data

                                                        setOpenDomain(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            valueDomain ===
                                                                domain.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {domain.name}
                                                    {/* Display domain name  */}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <InputError message={errors.domain_id} />
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

export default EditSpecialityDialog;
