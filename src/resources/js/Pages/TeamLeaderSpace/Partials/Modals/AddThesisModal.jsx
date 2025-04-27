import React, { useState, useContext, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/Components/ui/textarea";

const AddThesisModal = ({
    onClose,
    isOpen,
    labMembers,
    labMembersC,
    phdStudents,
    team,
}) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors, reset } = useForm({
        thesis_title: "",
        phd_student_id: "",
        supervisor_id: "",
        co_supervisor_id: "",
        email: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        emailc: "",
        passwordc: "",
        passwordc_confirmation: "",
        first_namec: "",
        last_namec: "",
        phone_numberc: "",
    });

    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOptionC, setSelectedOptionC] = useState("");

    const handleOptionChange = (value) => {
        setSelectedOption(value);
        setData({
            ...data, // keep other fields intact
            email: "",
            password: "",
            password_confirmation: "",
            first_name: "",
            last_name: "",
            phone_number: ""
        });
    };
    
    const handleOptionChangeC = (value) => {
        setSelectedOptionC(value);
        setData({
            ...data, // keep other fields intact
            emailc: "",
            passwordc: "",
            passwordc_confirmation: "",
            first_namec: "",
            last_namec: "",
            phone_numberc: ""
        });
    };
    
    

    const [openPhdStudent, setOpenPhdStudent] = useState(false);
    const [valuePhdStudent, setValuePhdStudent] = useState("");
    const [selectedPhdStudent, setSelectedPhdStudent] = useState(null);

    const [openSupervisor, setOpenSupervisor] = useState(false);
    const [valueSupervisor, setValueSupervisor] = useState("");
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);

    const [openCoSupervisor, setOpenCoSupervisor] = useState(false);
    const [valueCoSupervisor, setValueCoSupervisor] = useState("");
    const [selectedCoSupervisor, setSelectedCoSupervisor] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route("team.leader.phd.thesis.insert", { id: team.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Add New Thesis"
                            : language === "ar"
                            ? "إضافة أطروحة جديدة"
                            : "Ajouter une nouvelle thèse"}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            {/* Thesis Title */}
                            <div>
                                <Label htmlFor="thesis_title">
                                    {language === "en"
                                        ? "Thesis Title *"
                                        : language === "ar"
                                        ? "عنوان الأطروحة *"
                                        : "Titre de la thèse *"}
                                </Label>
                                <Input
                                    type="text"
                                    id="thesis_title"
                                    name="thesis_title"
                                    value={data.thesis_title}
                                    onChange={(e) =>
                                        setData("thesis_title", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.thesis_title} />
                            </div>

                            <div>
                                <Label htmlFor="phd_student_id">
                                    {language === "en"
                                        ? "Select Phd Student"
                                        : language === "ar"
                                        ? "اختر عضو مختبر"
                                        : "Sélectionnez un membre du laboratoire"}
                                </Label>
                                <Popover
                                    open={openPhdStudent}
                                    onOpenChange={setOpenPhdStudent}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openPhdStudent}
                                            className="w-full justify-between"
                                        >
                                            {selectedPhdStudent
                                                ? selectedPhdStudent
                                                : language === "en"
                                                ? "Select PhdStudent..."
                                                : language === "ar"
                                                ? "اختر المستخدم..."
                                                : "Sélectionnez l'utilisateur..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0  popover-content-width-full">
                                        <Command>
                                            <CommandInput
                                                placeholder={
                                                    language === "en"
                                                        ? "Search PhdStudent..."
                                                        : language === "ar"
                                                        ? "ابحث عن مستخدم..."
                                                        : "Rechercher un utilisateur..."
                                                }
                                            />
                                            <CommandEmpty>
                                                {language === "en"
                                                    ? "No Member found."
                                                    : language === "ar"
                                                    ? "لم يتم العثور على عضو."
                                                    : "Aucun membre trouvé."}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {phdStudents.map((member) => (
                                                    <CommandItem
                                                        key={member.id}
                                                        value={member.user?.id}
                                                        onSelect={() => {
                                                            setValuePhdStudent(
                                                                member.user.id
                                                            );
                                                            setSelectedPhdStudent(
                                                                `${member.user.first_name} ${member.user.last_name}`
                                                            );
                                                            setData(
                                                                "phd_student_id",
                                                                member.user.id
                                                            );

                                                            setOpenPhdStudent(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                valuePhdStudent ===
                                                                    member?.user?.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {member?.user?.first_name}{" "}
                                                        {member?.user?.last_name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <InputError message={errors.phd_student_id} />
                            </div>

                            <div>
                                <Label htmlFor="SupervisorType">
                                    {language === "en"
                                        ? "Supervisor"
                                        : language === "ar"
                                        ? "اختر نوع العضو"
                                        : "Sélectionnez le type de membre"}
                                </Label>
                                <Select onValueChange={handleOptionChange}>
                                    <SelectTrigger id="SupervisorType">
                                        <SelectValue
                                            placeholder={
                                                language === "en"
                                                    ? "Select Type"
                                                    : language === "ar"
                                                    ? "اختر النوع"
                                                    : "Sélectionnez le type"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lab">
                                            {language === "en"
                                                ? "In Lab"
                                                : language === "ar"
                                                ? "في المختبر"
                                                : "Dans le laboratoire"}
                                        </SelectItem>
                                        <SelectItem value="external">
                                            {language === "en"
                                                ? "External Member"
                                                : language === "ar"
                                                ? "عضو خارجي"
                                                : "Membre externe"}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedOption === "lab" && (
                                <div>
                                    <Label htmlFor="supervisor_id">
                                        {language === "en"
                                            ? "Select Supervisor"
                                            : language === "ar"
                                            ? "اختر عضو مختبر"
                                            : "Sélectionnez un membre du laboratoire"}
                                    </Label>
                                    <Popover
                                        open={openSupervisor}
                                        onOpenChange={setOpenSupervisor}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openSupervisor}
                                                className="w-full justify-between"
                                            >
                                                {selectedSupervisor
                                                    ? selectedSupervisor
                                                    : language === "en"
                                                    ? "Select Supervisor..."
                                                    : language === "ar"
                                                    ? "اختر المستخدم..."
                                                    : "Sélectionnez l'utilisateur..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0  popover-content-width-full">
                                            <Command>
                                                <CommandInput
                                                    placeholder={
                                                        language === "en"
                                                            ? "Search Supervisor..."
                                                            : language === "ar"
                                                            ? "ابحث عن مستخدم..."
                                                            : "Rechercher un utilisateur..."
                                                    }
                                                />
                                                <CommandEmpty>
                                                    {language === "en"
                                                        ? "No Member found."
                                                        : language === "ar"
                                                        ? "لم يتم العثور على عضو."
                                                        : "Aucun membre trouvé."}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {labMembers.map(
                                                        (member) => (
                                                            <CommandItem
                                                                key={member.id}
                                                                value={
                                                                    member.user
                                                                        .id
                                                                }
                                                                onSelect={() => {
                                                                    setValueSupervisor(
                                                                        member
                                                                            .user
                                                                            .id
                                                                    );
                                                                    setSelectedSupervisor(
                                                                        `${member.user.first_name} ${member.user.last_name}`
                                                                    );
                                                                    setData(
                                                                        "supervisor_id",
                                                                        member
                                                                            .user
                                                                            .id
                                                                    );

                                                                    setOpenSupervisor(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        valueSupervisor ===
                                                                            member
                                                                                .user
                                                                                .id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {
                                                                    member.user
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    member.user
                                                                        .last_name
                                                                }
                                                            </CommandItem>
                                                        )
                                                    )}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <InputError
                                        message={errors.supervisor_id}
                                    />
                                </div>
                            )}

                            {selectedOption === "external" && (
                                <>
                                    <div>
                                        <Label htmlFor="first_name">
                                            {language === "en"
                                                ? "First Name"
                                                : language === "ar"
                                                ? "الاسم الأول"
                                                : "Prénom"}
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    "first_name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.first_name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="last_name">
                                            {language === "en"
                                                ? "Last Name"
                                                : language === "ar"
                                                ? "الاسم الأخير"
                                                : "Nom de famille"}
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.last_name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">
                                            {language === "en"
                                                ? "Email"
                                                : language === "ar"
                                                ? "البريد الإلكتروني"
                                                : "E-mail"}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="password">
                                            {language === "en"
                                                ? "Password"
                                                : language === "ar"
                                                ? "كلمة السر"
                                                : "Mot de passe"}
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="password_confirmation">
                                            {language === "en"
                                                ? "Confirm Password"
                                                : language === "ar"
                                                ? "تأكيد كلمة السر"
                                                : "Confirmer le mot de passe"}
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone_number">
                                            {language === "en"
                                                ? "Phone Number"
                                                : language === "ar"
                                                ? "رقم الهاتف"
                                                : "Numéro de téléphone"}
                                        </Label>
                                        <Input
                                            id="phone_number"
                                            value={data.phone_number}
                                            onChange={(e) =>
                                                setData(
                                                    "phone_number",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.phone_number}
                                            className="mt-2"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <Label htmlFor="coSupervisorType">
                                    {language === "en"
                                        ? "  Co Supervisor"
                                        : language === "ar"
                                        ? "اختر نوع العضو"
                                        : "Sélectionnez le type de membre"}
                                </Label>
                                <Select onValueChange={handleOptionChangeC}>
                                    <SelectTrigger id="coSupervisorType">
                                        <SelectValue
                                            placeholder={
                                                language === "en"
                                                    ? "Select Type"
                                                    : language === "ar"
                                                    ? "اختر النوع"
                                                    : "Sélectionnez le type"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lab">
                                            {language === "en"
                                                ? "In Lab"
                                                : language === "ar"
                                                ? "في المختبر"
                                                : "Dans le laboratoire"}
                                        </SelectItem>
                                        <SelectItem value="external">
                                            {language === "en"
                                                ? "External Member"
                                                : language === "ar"
                                                ? "عضو خارجي"
                                                : "Membre externe"}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedOptionC === "lab" && (
                                <div>
                                    <Label htmlFor="co_supervisor_id">
                                        {language === "en"
                                            ? "Select Co Supervisor"
                                            : language === "ar"
                                            ? "اختر عضو مختبر"
                                            : "Sélectionnez un membre du laboratoire"}
                                    </Label>
                                    <Popover
                                        open={openCoSupervisor}
                                        onOpenChange={setOpenCoSupervisor}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openCoSupervisor}
                                                className="w-full justify-between"
                                            >
                                                {selectedCoSupervisor
                                                    ? selectedCoSupervisor
                                                    : language === "en"
                                                    ? "Select Co Supervisor..."
                                                    : language === "ar"
                                                    ? "اختر المستخدم..."
                                                    : "Sélectionnez l'utilisateur..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0  popover-content-width-full">
                                            <Command>
                                                <CommandInput
                                                    placeholder={
                                                        language === "en"
                                                            ? "Search Co Supervisor..."
                                                            : language === "ar"
                                                            ? "ابحث عن مستخدم..."
                                                            : "Rechercher un utilisateur..."
                                                    }
                                                />
                                                <CommandEmpty>
                                                    {language === "en"
                                                        ? "No Co Supervisor found."
                                                        : language === "ar"
                                                        ? "لم يتم العثور على عضو."
                                                        : "Aucun membre trouvé."}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {labMembersC.map(
                                                        (member) => (
                                                            <CommandItem
                                                                key={member.id}
                                                                value={
                                                                    member.user
                                                                        .id
                                                                }
                                                                onSelect={() => {
                                                                    setValueCoSupervisor(
                                                                        member
                                                                            .user
                                                                            .id
                                                                    );
                                                                    setSelectedCoSupervisor(
                                                                        `${member.user.first_name} ${member.user.last_name}`
                                                                    );
                                                                    setData(
                                                                        "co_supervisor_id",
                                                                        member
                                                                            .user
                                                                            .id
                                                                    );

                                                                    setOpenCoSupervisor(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        valueCoSupervisor ===
                                                                            member
                                                                                .user
                                                                                .id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {
                                                                    member.user
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    member.user
                                                                        .last_name
                                                                }
                                                            </CommandItem>
                                                        )
                                                    )}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <InputError
                                        message={errors.co_supervisor_id}
                                    />
                                </div>
                            )}

                            {selectedOptionC === "external" && (
                                <>
                                    <div>
                                        <Label htmlFor="first_namec">
                                            {language === "en"
                                                ? "First Name"
                                                : language === "ar"
                                                ? "الاسم الأول"
                                                : "Prénom"}
                                        </Label>
                                        <Input
                                            id="first_namec"
                                            value={data.first_namec}
                                            onChange={(e) =>
                                                setData(
                                                    "first_namec",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.first_namec}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="last_namec">
                                            {language === "en"
                                                ? "Last Name"
                                                : language === "ar"
                                                ? "الاسم الأخير"
                                                : "Nom de famille"}
                                        </Label>
                                        <Input
                                            id="last_namec"
                                            value={data.last_namec}
                                            onChange={(e) =>
                                                setData(
                                                    "last_namec",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.last_namec}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="emailc">
                                            {language === "en"
                                                ? "Email"
                                                : language === "ar"
                                                ? "البريد الإلكتروني"
                                                : "E-mail"}
                                        </Label>
                                        <Input
                                            id="emailc"
                                            type="email"
                                            value={data.emailc}
                                            onChange={(e) =>
                                                setData(
                                                    "emailc",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.emailc}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="passwordc">
                                            {language === "en"
                                                ? "Password"
                                                : language === "ar"
                                                ? "كلمة السر"
                                                : "Mot de passe"}
                                        </Label>
                                        <Input
                                            id="passwordc"
                                            type="password"
                                            value={data.passwordc}
                                            onChange={(e) =>
                                                setData(
                                                    "passwordc",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.passwordc}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="passwordc_confirmation">
                                            {language === "en"
                                                ? "Confirm Password"
                                                : language === "ar"
                                                ? "تأكيد كلمة السر"
                                                : "Confirmer le mot de passe"}
                                        </Label>
                                        <Input
                                            id="passwordc_confirmation"
                                            type="password"
                                            value={data.passwordc_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "passwordc_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors.passwordc_confirmation
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone_numberc">
                                            {language === "en"
                                                ? "Phone Number"
                                                : language === "ar"
                                                ? "رقم الهاتف"
                                                : "Numéro de téléphone"}
                                        </Label>
                                        <Input
                                            id="phone_numberc"
                                            value={data.phone_numberc}
                                            onChange={(e) =>
                                                setData(
                                                    "phone_numberc",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.phone_numberc}
                                            className="mt-2"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-white"
                            disabled={processing}
                        >
                            {language === "en"
                                ? "Add Thesis"
                                : language === "ar"
                                ? "إضافة الأطروحة"
                                : "Ajouter la thèse"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddThesisModal;
