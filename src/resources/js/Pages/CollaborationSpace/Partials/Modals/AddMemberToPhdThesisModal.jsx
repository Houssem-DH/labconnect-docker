import React, { useState, useContext } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { LanguageContext } from "@/lib/LanguageContext";
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

const AddLabMemberModal = ({ onClose, phd_thesis, lab_members ,external_members}) => {
    const { language } = useContext(LanguageContext);
    const [selectedOption, setSelectedOption] = useState("");
    const { data, setData, post, processing, errors, reset } = useForm({
        lab_m: "",
        ext_m: "",
        invitations_abstract: "",
      
    });

    const handleOptionChange = (value) => {
        setSelectedOption(value);
        reset();
    };

    const [openUser, setOpenUser] = useState(false);
    const [valueUser, setValueUser] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const [openUser2, setOpenUser2] = useState(false);
    const [valueUser2, setValueUser2] = useState("");
    const [selectedUser2, setSelectedUser2] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("collaboration.space.phd.thesis.member.insert", { id: phd_thesis.id }), {
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
                                                        value={member?.user?.id}
                                                        onSelect={() => {
                                                            setValueUser(
                                                                member?.user?.id
                                                            );
                                                            setSelectedUser(
                                                                `${member?.user?.first_name} ${member?.user?.last_name}`
                                                            );
                                                            setData(
                                                                "lab_m",
                                                                member?.user?.id
                                                            );

                                                            setOpenUser(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                valueUser ===
                                                                    member?.user?.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {member?.user?.first_name}{" "}
                                                        {
                                                            member?.user?.last_name
                                                        }
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <InputError message={errors.lab_m} />
                            </div>
                        )}

                        {selectedOption === "external" && (
                           <div>
                           <Label htmlFor="user_id">
                               {language === "en"
                                   ? "Select Lab Member"
                                   : language === "ar"
                                   ? "اختر عضو مختبر"
                                   : "Sélectionnez un membre du laboratoire"}
                           </Label>
                           <Popover
                               open={openUser2}
                               onOpenChange={setOpenUser2}
                           >
                               <PopoverTrigger asChild>
                                   <Button
                                       variant="outline"
                                       role="combobox"
                                       aria-expanded={openUser2}
                                       className="w-full justify-between"
                                   >
                                       {selectedUser2
                                           ? selectedUser2
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
                                           {external_members.map((member) => (
                                               <CommandItem
                                                   key={member.id}
                                                   value={member.user.id}
                                                   onSelect={() => {
                                                       setValueUser2(
                                                           member.user.id
                                                       );
                                                       setSelectedUser2(
                                                           `${member.user.first_name} ${member.user.last_name}`
                                                       );
                                                       setData(
                                                           "ext_m",
                                                           member.user.id
                                                       );

                                                       setOpenUser2(false);
                                                   }}
                                               >
                                                   <Check
                                                       className={cn(
                                                           "mr-2 h-4 w-4",
                                                           valueUser2 ===
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

                           <InputError message={errors.ext_m} />
                       </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <Label htmlFor="invitations_abstract">Invitations Abstract</Label>
                        <Textarea
                            id="invitations_abstract"
                            name="invitations_abstract"
                            value={data.invitations_abstract}
                            onChange={(e) =>
                                setData("invitations_abstract", e.target.value)
                            }
                            placeholder="Enter Invitations Abstract"
                            className="mt-1 block w-full border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        {errors.invitations_abstract && (
                            <p className="text-red-500 mt-2">
                                {errors.invitations_abstract}
                            </p>
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
