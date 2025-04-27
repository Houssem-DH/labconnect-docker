import React, { useState, useContext } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { LanguageContext } from "@/lib/LanguageContext";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { FiTrash2, FiPlus, FiChevronRight } from "react-icons/fi";
import { Link, Head } from "@inertiajs/react";
import Select from "react-select";
import { customStyles } from "@/styles";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/Components/ui/command";

import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

import { Check, ChevronsUpDown, Search } from "lucide-react"; // Assuming you have a Checkbox component in Shadcn UI

const InviteLabs = ({
    onClose,
    isOpen,
    lab,
    labs,
    establishments,
    doms,
    project,
}) => {
    const { language } = useContext(LanguageContext);

    const { data, setData, post, errors, reset } = useForm({
        domains: [], // Ensure domains is initialized
        labs: [], // Track selected lab IDs
    });

    const [domains, setDomains] = useState([]);

    const [openDomains, setOpenDomains] = useState({}); // Use an object to track open state of each domain

    const handleAddDomains = () => setDomains([...domains, ""]);
    const handleRemoveDomains = (index) => {
        const updatedDomains = [...domains];
        updatedDomains.splice(index, 1);
        setDomains(updatedDomains);

        const updatedDom = [...data.domains];
        updatedDom.splice(index, 1);
        setData("domains", updatedDom);
    };
    const handleDomainsChange = (e, index) => {
        const updatedDomains = [...domains];
        updatedDomains[index] = e.target.value;
        setDomains(updatedDomains);

        const updatedDom = [...data.domains];
        updatedDom[index] = e.target.value;
        setData("domains", updatedDom);
    };

    const handlePopoverToggle = (index) => {
        setOpenDomains((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleLeaderChange = (selectedOption) => {
        setData(
            "project_leader_id",
            selectedOption ? selectedOption.value : ""
        );
    };

    const [selectedLabs, setSelectedLabs] = useState([]);
    const [openPopovers, setOpenPopovers] = useState([]);
    const [filteredLabs, setFilteredLabs] = useState([]);

    const handleAddLab = () => {
        setSelectedLabs([...selectedLabs, { establishment: null, lab: null }]);
        setOpenPopovers([...openPopovers, false]);
    };

    const handleRemoveLab = (index) => {
        const updatedLabs = [...selectedLabs];
        updatedLabs.splice(index, 1);
        setSelectedLabs(updatedLabs);

        const updatedLabIds = data.labs.filter((_, i) => i !== index);
        setData("labs", updatedLabIds);

        const updatedOpenPopovers = [...openPopovers];
        updatedOpenPopovers.splice(index, 1);
        setOpenPopovers(updatedOpenPopovers);
    };

    const handleEstablishmentChange = (index, selectedOption) => {
        const establishmentName = selectedOption?.label;
        setSelectedLabs((prevLabs) => {
            const updatedLabs = [...prevLabs];
            updatedLabs[index] = {
                ...updatedLabs[index],
                establishment: establishmentName,
            };

            // Filter labs based on the selected establishment
            const newFilteredLabs = labs.filter(
                (lab) => lab.establishment === establishmentName
            );
            setFilteredLabs(
                newFilteredLabs.map((lab) => ({
                    value: lab.id,
                    label: lab.title,
                }))
            );

            return updatedLabs;
        });
    };

    const handleLabChange = (index, selectedOption) => {
        const updatedLabs = [...selectedLabs];
        updatedLabs[index] = { ...updatedLabs[index], lab: selectedOption };
        setSelectedLabs(updatedLabs);

        const updatedLabIds = updatedLabs
            .map((lab) => lab.lab?.value)
            .filter((id) => id);
        setData("labs", updatedLabIds);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("collaboration.space.projects.invite.labs", { id: project.id }), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen p-6">
                <DialogHeader>
                    <DialogTitle>Invite Labs</DialogTitle>
                    <DialogDescription>
                        {/* Add additional description if needed */}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="domains">
                                Invite Labs By Domain
                            </Label>
                            <Button
                                type="button"
                                onClick={handleAddDomains}
                                className="flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Invite Labs By Domain
                            </Button>
                        </div>
                        {domains.map((domain, index) => (
                            <div
                                key={index}
                                className="flex items-center mb-2 p-4"
                            >
                                <Popover
                                    open={openDomains[index] || false}
                                    onOpenChange={() =>
                                        handlePopoverToggle(index)
                                    }
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            aria-expanded={
                                                openDomains[index] || false
                                            }
                                            className="w-full justify-between"
                                            role="combobox"
                                        >
                                            {data.domains[index] ||
                                                "Select Domain..."}
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
                                                {doms.map((dom) => (
                                                    <CommandItem
                                                        key={dom.id}
                                                        value={dom.id}
                                                        onSelect={() => {
                                                            const updatedDomains =
                                                                [
                                                                    ...data.domains,
                                                                ];
                                                            updatedDomains[
                                                                index
                                                            ] = dom.name; // Use domain name
                                                            setData(
                                                                "domains",
                                                                updatedDomains
                                                            );
                                                            setOpenDomains(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [index]: false,
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={`mr-2 h-4 w-4 ${
                                                                data.domains[
                                                                    index
                                                                ] === dom.name
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }`}
                                                        />
                                                        {dom.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <Button
                                    type="button"
                                    onClick={() => handleRemoveDomains(index)}
                                    variant="destructive"
                                    className="ml-2 bg-red-600 text-white hover:bg-red-700"
                                >
                                    <FiTrash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {errors.domains && (
                            <p className="text-red-500 mt-2">
                                {errors.domains}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <Label htmlFor="domains">
                            Invite Labs By Establishment
                        </Label>

                        <Button
                            type="button"
                            onClick={handleAddLab}
                            className="flex items-center"
                        >
                            <FiPlus className="mr-2" />
                            Invite Labs By Establishment
                        </Button>
                    </div>
                    {selectedLabs.map((lab, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2 bg-white p-4 rounded-md shadow-sm"
                        >
                            <Popover
                                open={openPopovers[index] || false}
                                onOpenChange={() =>
                                    setOpenPopovers((prev) => {
                                        const newState = [...prev];
                                        newState[index] = !newState[index];
                                        return newState;
                                    })
                                }
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                        role="combobox"
                                    >
                                        {lab.establishment ||
                                            "Select Establishment..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-80">
                                    <Command>
                                        <CommandInput placeholder="Search Establishment..." />
                                        <CommandEmpty>
                                            No Establishment found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {establishments.map((est) => (
                                                <CommandItem
                                                    key={est.id}
                                                    value={est.name}
                                                    onSelect={() => {
                                                        handleEstablishmentChange(
                                                            index,
                                                            {
                                                                value: est.id,
                                                                label: est.name,
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={`mr-2 h-4 w-4 ${
                                                            lab.establishment ===
                                                            est.name
                                                                ? "text-green-600"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                    {est.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                        role="combobox"
                                    >
                                        {lab.lab
                                            ? `Selected Lab: ${lab.lab.label}`
                                            : "Select Lab"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-80">
                                    <Command>
                                        <CommandInput placeholder="Search Lab..." />
                                        <CommandEmpty>
                                            No Lab found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {filteredLabs.map((labOption) => (
                                                <CommandItem
                                                    key={labOption.value}
                                                    value={labOption.value}
                                                    onSelect={() => {
                                                        handleLabChange(
                                                            index,
                                                            labOption
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={`mr-2 h-4 w-4 ${
                                                            lab.lab?.value ===
                                                            labOption.value
                                                                ? "text-main"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                    {labOption.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <Button
                                type="button"
                                onClick={() => handleRemoveLab(index)}
                                variant="destructive"
                                className="ml-2 bg-red-600 text-white hover:bg-red-700"
                            >
                                <FiTrash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {errors.labs && (
                        <p className="text-red-500 mt-2">{errors.labs}</p>
                    )}

                    <div className="flex justify-between mt-4">
                        <Button type="submit">Add</Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default InviteLabs;
