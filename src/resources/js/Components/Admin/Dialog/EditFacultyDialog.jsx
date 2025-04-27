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

function EditEstDialog({ faculty, establishments, users, isOpen, onClose }) {
    const { language } = useContext(LanguageContext);

    const { data, setData, put, errors } = useForm({
        user_id: faculty.user_id,
        establishment_id: faculty.establishment_id,
        name: faculty.name,
    });

    const [openAdmin, setOpenAdmin] = useState(false); // Change to true to make the dialog initially open
    const [valueAdmin, setValueAdmin] = useState(faculty.user_id);
    const [selectedUser, setSelectedUser] = useState(
        `${faculty.user.first_name} ${faculty.user.last_name}`
    );

    const [openEst, setOpenEst] = useState(false); // Change to true to make the dialog initially open
    const [valueEst, setValueEst] = useState(faculty.establishment_id);
    const [selectedEst, setSelectedEst] = useState(faculty.establishment.name);

    const submit = (e) => {
        e.preventDefault();

        put(route("dashboard.faculty.edit", { id: faculty.id }), {
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
                            ? "Edit Establishment"
                            : language === "ar"
                            ? "تعديل المنشأة"
                            : "Modifier établissement"}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            <Label htmlFor="Admin">
                                {" "}
                                {language === "en"
                                    ? "Enter the Admin"
                                    : language === "ar"
                                    ? "أدخل الاسم"
                                    : "Entrez le Admin"}
                            </Label>
                            <Popover
                                open={openAdmin}
                                onOpenChange={setOpenAdmin}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openAdmin}
                                        className="w-full justify-between"
                                    >
                                        {selectedUser
                                            ? selectedUser
                                            : "Select user..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0  popover-content-width-full">
                                    <Command>
                                        <CommandInput placeholder="Search framework..." />
                                        <CommandEmpty>
                                            No admin found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {users.map((user) => (
                                                <CommandItem
                                                    key={user.id}
                                                    value={user.id}
                                                    onSelect={() => {
                                                        setValueAdmin(user.id); // Set value directly as user id
                                                        setSelectedUser(
                                                            `${user.first_name} ${user.last_name}`
                                                        ); // Set selectedUser with first name and last name
                                                        setData(
                                                            "user_id",
                                                            user.id
                                                        ); // Set form data

                                                        setOpenAdmin(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            valueAdmin ===
                                                                user.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {user.first_name}{" "}
                                                    {user.last_name}
                                                    {/* Display first name and last name */}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <InputError message={errors.user_id} />
                        </div>

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
                            <Label htmlFor="Establishment">
                                {" "}
                                {language === "en"
                                    ? "Enter the Establishment"
                                    : language === "ar"
                                    ? "أدخل الاسم"
                                    : "Entrez le Establishment"}
                            </Label>
                            <Popover open={openEst} onOpenChange={setOpenEst}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openEst}
                                        className="w-full justify-between"
                                    >
                                        {selectedEst
                                            ? selectedEst
                                            : "Select establishment..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0  popover-content-width-full">
                                    <Command>
                                        <CommandInput placeholder="Search framework..." />
                                        <CommandEmpty>
                                            No establishment found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {establishments.map((est) => (
                                                <CommandItem
                                                    key={est.id}
                                                    value={est.id}
                                                    onSelect={() => {
                                                        setValueEst(est.id); // Set value directly as est id
                                                        setSelectedEst(
                                                            est.name
                                                        ); // Set seleted Est with first name and last name
                                                        setData(
                                                            "establishment_id",
                                                            est.id
                                                        ); // Set form data

                                                        setOpenEst(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            valueEst === est.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {est.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.establishment_id} />
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

export default EditEstDialog;
