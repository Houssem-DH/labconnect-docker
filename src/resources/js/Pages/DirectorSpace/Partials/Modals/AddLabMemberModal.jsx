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

const AddLabMemberModal = ({
    onClose,
    isOpen,
    lab,
    teams,
    domains,
    specialities,
}) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        user_id: null,
        domain_id: "",
        speciality_id: "",
        phone: null,
        member_rank: "",
        member_type: "",
        team_id: "",
        password: "",
        password_confirmation: "",
        isProject_leader: false,
        isTeam_leader: false,
        isMember: false,
        isPhd_student: false,
        support_stuff: false,
        researcher: false,
        researcher_establishment: false,
        researcher_out_establishment: false,
        associated_researcher: false,
        is_project_member: false,
        is_supervisor: false,
        is_co_supervisor: false,
    });

    const [DomainId, setDomainId] = useState(null);
    const [DomainName, setDomainName] = useState(null);
    const [openDomain, setOpenDomain] = useState(false);
    const [valueDomain, setValueDomain] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState("");

    const [SpecialityId, setSpecialityId] = useState(null);
    const [SpecialityName, setSpecialityName] = useState(null);
    const [openSpeciality, setOpenSpeciality] = useState(false);
    const [valueSpeciality, setValueSpeciality] = useState(null);
    const [selectedSpeciality, setSelectedSpeciality] = useState("");

    const [TeamId, setTeamId] = useState(null);
    const [TeamName, setTeamName] = useState(null);
    const [openTeam, setOpenTeam] = useState(false);
    const [valueTeam, setValueTeam] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState("");

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
                    <DialogTitle>Add New Lab member</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            <Label htmlFor="first_name">
                                {" "}
                                {language === "en"
                                    ? "First Name *"
                                    : language === "ar"
                                    ? "اللقب"
                                    : "Nom  *"}
                            </Label>
                            <Input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={data.first_name}
                                autoComplete="first_name"
                                placeholder={
                                    language === "en"
                                        ? "First Name"
                                        : language === "ar"
                                        ? "اللقب"
                                        : "Nom"
                                }
                                onChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.first_name} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="last_name">
                                {language === "en"
                                    ? "Last Name *"
                                    : language === "ar"
                                    ? "الاسم"
                                    : "Prenom *"}
                            </Label>
                            <Input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={data.last_name}
                                placeholder={
                                    language === "en"
                                        ? "Last Name"
                                        : language === "ar"
                                        ? "الاسم"
                                        : "Prenom"
                                }
                                autoComplete="last_name"
                                onChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.last_name} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="email">
                                {" "}
                                {language === "en"
                                    ? "Email *"
                                    : language === "ar"
                                    ? "البريد الالكتروني"
                                    : "Email *"}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder={
                                    language === "en"
                                        ? "Enter your email"
                                        : language === "ar"
                                        ? "أدخل بريدك الإلكتروني"
                                        : "Tapez votre Email"
                                }
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="tlp">
                                {language === "en"
                                    ? "Phone (Optional)"
                                    : language === "ar"
                                    ? "الهاتف *"
                                    : "Téléphone *"}
                            </Label>
                            <Input
                               
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                               
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={
                                    language === "en"
                                        ? "Phone"
                                        : language === "ar"
                                        ? "الهاتف"
                                        : "Téléphone"
                                }
                            >
                               
                            </Input>
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="member_rank">
                                {language === "en"
                                    ? "Member Rank *"
                                    : language === "ar"
                                    ? "الولاية"
                                    : "Member Rank *"}
                            </Label>

                            <Select
                                id="member_rank"
                                name="member_rank"
                                value={data.member_rank}
                                onValueChange={(value) => {
                                    setData("member_rank", value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            language === "en"
                                                ? "Select Member Rank"
                                                : language === "ar"
                                                ? "اختر ولاية"
                                                : "Select Member Rank"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Prof.">
                                            Prof.
                                        </SelectItem>
                                        <SelectItem value="MCA">MCA</SelectItem>
                                        <SelectItem value="MCB">MCB</SelectItem>
                                        <SelectItem value="MAA">MAA</SelectItem>
                                        <SelectItem value="MAB">MAB</SelectItem>
                                        <SelectItem value="Doctorant">
                                            Doctorant
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <InputError message={errors.member_rank} />
                        </div>

                        <div>
                            <Label htmlFor="member_type">
                                {language === "en"
                                    ? "Member Type *"
                                    : language === "ar"
                                    ? "الولاية"
                                    : "Member Type *"}
                            </Label>

                            <Select
                                id="member_type"
                                name="member_type"
                                value={data.member_type}
                                onValueChange={(value) => {
                                    setData("member_type", value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            language === "en"
                                                ? "Select Member Type"
                                                : language === "ar"
                                                ? "اختر ولاية"
                                                : "Select Member Type"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Permanent member">
                                            Permanent member
                                        </SelectItem>
                                        <SelectItem value="Non-permanent member">
                                            Non-permanent member
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <InputError message={errors.member_type} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="domain">
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
                                <PopoverContent className="p-0 popover-content-width-full">
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
                                                        setDomainId(domain.id);
                                                        setDomainName(
                                                            domain.name
                                                        );
                                                        setValueDomain(
                                                            domain.id
                                                        );
                                                        setSelectedDomain(
                                                            domain.name
                                                        );
                                                        setData(
                                                            "domain_id",
                                                            domain.id
                                                        );
                                                        setSelectedSpeciality(
                                                            null
                                                        );
                                                        setValueSpeciality(
                                                            null
                                                        );
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
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.domain_id} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="speciality">
                                {language === "en"
                                    ? "Speciality"
                                    : language === "ar"
                                    ? "البلدية"
                                    : "Spécialité"}
                            </Label>
                            <Popover
                                open={openSpeciality}
                                onOpenChange={setOpenSpeciality}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openSpeciality}
                                        className="w-full justify-between"
                                    >
                                        {selectedSpeciality
                                            ? selectedSpeciality
                                            : "Select Speciality..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 popover-content-width-full">
                                    <Command>
                                        <CommandInput placeholder="Search Speciality..." />
                                        <CommandEmpty>
                                            No Speciality found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {specialities
                                                .filter(
                                                    (speciality) =>
                                                        speciality.domain_id ===
                                                        DomainId
                                                )
                                                .map((speciality) => (
                                                    <CommandItem
                                                        key={speciality.id}
                                                        value={speciality.id}
                                                        onSelect={() => {
                                                            setSpecialityId(
                                                                speciality.id
                                                            );
                                                            setSpecialityName(
                                                                speciality.name
                                                            );
                                                            setValueSpeciality(
                                                                speciality.id
                                                            );
                                                            setSelectedSpeciality(
                                                                speciality.name
                                                            );
                                                            setData(
                                                                "speciality_id",
                                                                speciality.id
                                                            );
                                                            setOpenSpeciality(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                valueSpeciality ===
                                                                    speciality.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {speciality.name}
                                                    </CommandItem>
                                                ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.speciality_id} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="team_id">
                                {" "}
                                {language === "en"
                                    ? "Enter the Team"
                                    : language === "ar"
                                    ? "أدخل الاسم"
                                    : "Entrez l'equipe"}
                            </Label>
                            <Popover open={openTeam} onOpenChange={setOpenTeam}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openTeam}
                                        className="w-full justify-between"
                                    >
                                        {selectedTeam
                                            ? selectedTeam
                                            : "Select Team..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 popover-content-width-full">
                                    <Command>
                                        <CommandInput placeholder="Search Team..." />
                                        <CommandEmpty>
                                            No Team found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {teams.map((team) => (
                                                <CommandItem
                                                    key={team.id}
                                                    value={team.id}
                                                    onSelect={() => {
                                                        setTeamId(team.id);
                                                        setTeamName(team.title);
                                                        setValueTeam(team.id);
                                                        setSelectedTeam(
                                                            team.title
                                                        );
                                                        setData(
                                                            "team_id",
                                                            team.id
                                                        );

                                                        setOpenTeam(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            valueTeam ===
                                                                team.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {team.title}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.domain_id} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="password">
                                {" "}
                                {language === "en"
                                    ? "Password *"
                                    : language === "ar"
                                    ? "كلمة السر"
                                    : "Mot de passe *"}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder={
                                    language === "en"
                                        ? "Enter your Password"
                                        : language === "ar"
                                        ? "أدخل كلمة السر"
                                        : "Tapez votre mot de passe"
                                }
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="password">
                                {" "}
                                {language === "en"
                                    ? "Confirm Password *"
                                    : language === "ar"
                                    ? "تأكيد  كلمة السر"
                                    : "Confirmer Le Mot de passe *"}
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder={
                                    language === "en"
                                        ? "Confirm Password"
                                        : language === "ar"
                                        ? "تأكيد  كلمة السر"
                                        : "Confirmer Le Mot de passe"
                                }
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <h3 className="block font-medium text-sm text-gray-700">
                                {language === "en"
                                    ? "Roles *"
                                    : language === "ar"
                                    ? "الأدوار"
                                    : "Rôles *"}
                            </h3>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="isProject_leader"
                                        checked={data.isProject_leader}
                                        onCheckedChange={(checked) =>
                                            setData("isProject_leader", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="isProject_leader"
                                        className="ml-2"
                                    >
                                        Project Leader
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="isTeam_leader"
                                        checked={data.isTeam_leader}
                                        onCheckedChange={(checked) =>
                                            setData("isTeam_leader", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="isTeam_leader"
                                        className="ml-2"
                                    >
                                        Team Leader
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="isMember"
                                        checked={data.isMember}
                                        onCheckedChange={(checked) =>
                                            setData("isMember", checked)
                                        }
                                    />
                                    <Label htmlFor="isMember" className="ml-2">
                                        Member
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="isPhd_student"
                                        checked={data.isPhd_student}
                                        onCheckedChange={(checked) =>
                                            setData("isPhd_student", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="isPhd_student"
                                        className="ml-2"
                                    >
                                        PhD Student
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="support_stuff"
                                        checked={data.support_stuff}
                                        onCheckedChange={(checked) =>
                                            setData("support_stuff", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="support_stuff"
                                        className="ml-2"
                                    >
                                        Support Staff
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="researcher"
                                        checked={data.researcher}
                                        onCheckedChange={(checked) =>
                                            setData("researcher", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="researcher"
                                        className="ml-2"
                                    >
                                        Researcher
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="researcher_establishment"
                                        checked={data.researcher_establishment}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "researcher_establishment",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="researcher_establishment"
                                        className="ml-2"
                                    >
                                        Researcher (Establishment)
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="researcher_out_establishment"
                                        checked={
                                            data.researcher_out_establishment
                                        }
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "researcher_out_establishment",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="researcher_out_establishment"
                                        className="ml-2"
                                    >
                                        Researcher (Outside Establishment)
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="associated_researcher"
                                        checked={data.associated_researcher}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "associated_researcher",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="associated_researcher"
                                        className="ml-2"
                                    >
                                        Associated Researcher
                                    </Label>
                                </div>

                                <div className="flex items-center">
                                    <Checkbox
                                        id="is_project_member"
                                        checked={data.is_project_member}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "is_project_member",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_project_member"
                                        className="ml-2"
                                    >
                                        Project Member
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="is_supervisor"
                                        checked={data.is_supervisor}
                                        onCheckedChange={(checked) =>
                                            setData("is_supervisor", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_supervisor"
                                        className="ml-2"
                                    >
                                        Supervisor
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="is_co_supervisor"
                                        checked={data.is_co_supervisor}
                                        onCheckedChange={(checked) =>
                                            setData("is_co_supervisor", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_co_supervisor"
                                        className="ml-2"
                                    >
                                        Co-Supervisor
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full  text-white "
                            disabled={processing}
                        >
                            {language === "en"
                                ? "Add Member"
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
