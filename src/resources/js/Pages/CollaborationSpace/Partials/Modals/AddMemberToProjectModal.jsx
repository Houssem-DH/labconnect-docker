import React, { useState, useContext } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { LanguageContext } from "@/lib/LanguageContext";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
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

const AddLabMemberModal = ({ onClose, project, lab_members }) => {
    const { language } = useContext(LanguageContext);
    const [selectedOption, setSelectedOption] = useState("");
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone_number: "",
    });

    const handleOptionChange = (value) => {
        setSelectedOption(value);
        reset();
    };

    const [openUser, setOpenUser] = useState(false);
    const [valueUser, setValueUser] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("collaboration.space.project.member.insert", { id: project.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Add Lab Member"
                            : language === "ar"
                            ? "إضافة عضو مختبر"
                            : "Ajouter un membre du laboratoire"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="memberType">
                                {language === "en"
                                    ? "Select Member Type"
                                    : language === "ar"
                                    ? "اختر نوع العضو"
                                    : "Sélectionnez le type de membre"}
                            </Label>
                            <Select onValueChange={handleOptionChange}>
                                <SelectTrigger id="memberType">
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
                                <Label htmlFor="user_id">
                                    {language === "en"
                                        ? "Select Lab Member"
                                        : language === "ar"
                                        ? "اختر عضو مختبر"
                                        : "Sélectionnez un membre du laboratoire"}
                                </Label>
                                <Popover
                                    open={openUser}
                                    onOpenChange={setOpenUser}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openUser}
                                            className="w-full justify-between"
                                        >
                                            {selectedUser
                                                ? selectedUser
                                                : language === "en"
                                                ? "Select user..."
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
                                                        ? "Search user..."
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
                                                {lab_members.map((member) => (
                                                    <CommandItem
                                                        key={member.id}
                                                        value={member.user.id}
                                                        onSelect={() => {
                                                            setValueUser(
                                                                member.user.id
                                                            );
                                                            setSelectedUser(
                                                                `${member.user.first_name} ${member.user.last_name}`
                                                            );
                                                            setData(
                                                                "user_id",
                                                                member.user.id
                                                            );

                                                            setOpenUser(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                valueUser ===
                                                                    member.user
                                                                        .id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {member.user
                                                            .first_name}{" "}
                                                        {
                                                            member.user
                                                                .last_name
                                                        }
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <InputError message={errors.user_id} />
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
                                            setData("last_name", e.target.value)
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
                                            setData("password", e.target.value)
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
                                        message={errors.password_confirmation}
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
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {language === "en"
                                ? "Add Member"
                                : language === "ar"
                                ? "أضف العضو"
                                : "Ajouter un membre"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLabMemberModal;
