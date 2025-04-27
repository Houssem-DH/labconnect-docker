import React, { useEffect, useContext, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import InputError from "@/Components/InputError";

import { Button } from "@/Components/ui/button";

import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

import { Check, ChevronsUpDown } from "lucide-react";

const EditLabMemberModal = ({
    onClose,
    isOpen,
    lab_member,
    teams,
    domains,
    specialities,
}) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, put, processing, errors, reset } = useForm({
        isProject_leader: lab_member.project_leader,
        isTeam_leader: lab_member.team_leader,
        isMember: lab_member.member,
        isPhd_student: lab_member.phd_student,
        support_stuff: lab_member.support_stuff,
        researcher: lab_member.researcher,
        researcher_establishment: lab_member.researcher_establishment,
        researcher_out_establishment: lab_member.researcher_out_establishment,
        associated_researcher: lab_member.associated_researcher,
        is_project_member: lab_member.is_project_member,
        is_supervisor: lab_member.is_supervisor,
        is_co_supervisor: lab_member.is_co_supervisor,
        member_rank: lab_member.member_rank,
        domain_id: "",
        speciality_id: "",
        member_type: lab_member.member_type,
        team_id: lab_member.team_member
            ? lab_member.team_member.team_id || ""
            : "",
    });

    const [DomainId, setDomainId] = useState(null);
    const [openDomain, setOpenDomain] = useState(false);
    const [valueDomain, setValueDomain] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState("");

    const [openSpeciality, setOpenSpeciality] = useState(false);
    const [valueSpeciality, setValueSpeciality] = useState(null);
    const [selectedSpeciality, setSelectedSpeciality] = useState("");

    const [openTeam, setOpenTeam] = useState(false);
    const [valueTeam, setValueTeam] = useState(
        lab_member.team_member ? lab_member.team_member.team_id || "" : ""
    );
    const [selectedTeam, setSelectedTeam] = useState(
        lab_member.team_member ? lab_member.team_member.team.title || "" : ""
    );

    useEffect(() => {
        if (domains.length > 0 && lab_member.research_domain) {
            const foundDomain = domains.find(
                (d) => d.name === lab_member.research_domain
            );
            if (foundDomain) {
                setDomainId(foundDomain.id);

                setValueDomain(foundDomain.id);
                setSelectedDomain(foundDomain.name);

                setData("domain_id", foundDomain.id);
            }
        }
    }, [lab_member.research_domain, domains]);

    useEffect(() => {
        if (DomainId) {
            const filteredSpecialities = specialities.filter(
                (speciality) => speciality.domain_id === DomainId
            );

            if (filteredSpecialities.length > 0) {
                const speciality = filteredSpecialities.find(
                    (s) => s.name === lab_member.research_specialty
                );
                if (speciality) {
                    setValueSpeciality(speciality.id);
                    setSelectedSpeciality(speciality.name);

                    setData("speciality_id", speciality.id);
                }
            }
        }
    }, [DomainId, lab_member.research_speciality, specialities]);

    const submit = (e) => {
        e.preventDefault();
        put(route("lab.member.edit", { id: lab_member.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className=" max-w-3xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>Edit Lab Member</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
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

                            <InputError message={errors.wilaya} />
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
                                ? "Edit Lab Member"
                                : language === "ar"
                                ? "انشاء الحساب"
                                : "Edit Lab Member"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditLabMemberModal;
