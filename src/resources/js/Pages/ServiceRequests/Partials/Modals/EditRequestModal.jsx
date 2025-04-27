import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";  // Import Shadcn UI select components
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
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useForm } from "@inertiajs/react";
import { Check, ChevronsUpDown, Search } from "lucide-react"; // Assuming you have a Checkbox component in Shadcn UI

const EditRequestServiceModal = ({
    onClose,
    isOpen,
    request,
    doms,
    labs,
    establishments,
    user,
}) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        applicant_type: request.applicant_type,
        title: request.title,
        description: request.description,
        applicant_tlp: request.applicant_tlp,
        applicant_adresse_email: request.applicant_adresse_email,
        request_date: request.request_date,
        required_by: request.required_by,
        comments: request.comments,
        domains: [],
        labs: [],
    });
    console.log(data.request_date);
    

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
        put(route("service.request.edit", { id: request.id }), {
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                if (errors) {
                    setData(errors);
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen p-6">
                <DialogHeader>
                    <DialogTitle>Reqquest A service</DialogTitle>
                    <DialogDescription>
                        {/* Add additional description if needed */}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="flex flex-col py-4 space-y-4">
                        <Label htmlFor="applicant_type">Type</Label>
                        <Select
                                    id="applicant_type"
                                    value={data.applicant_type}
                                    onValueChange={(value) => setData("applicant_type", value)}
                                    className="focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usine">Factory</SelectItem>
                                        <SelectItem value="laboratoire">Laboratory</SelectItem>
                                        <SelectItem value="simple_citoyen">Simple Citizen</SelectItem>
                                        <SelectItem value="hopital">Hospital</SelectItem>
                                        <SelectItem value="faculte_universitaire">University Faculty</SelectItem>
                                    </SelectContent>
                                </Select>
                        {errors.applicant_type && (
                            <p className="text-red-500">
                                {errors.applicant_type}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col py-3 space-y-3">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Enter title"
                            className="w-full"
                        />
                        {errors.title && (
                            <p className="text-red-500">{errors.title}</p>
                        )}
                    </div>
                    <div className="flex flex-col py-3 space-y-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            placeholder="Enter description"
                            className="w-full"
                        />
                        {errors.description && (
                            <p className="text-red-500">{errors.description}</p>
                        )}
                    </div>
                    {/* Additional Fields */}
                    <div className="flex flex-col py-3 space-y-3">
                        <Label htmlFor="applicant_tlp">
                            TLP (Phone)
                        </Label>
                        <Input
                            id="applicant_tlp"
                            value={data.applicant_tlp}
                            onChange={(e) =>
                                setData("applicant_tlp", e.target.value)
                            }
                            placeholder="Enter phone number"
                            className="w-full"
                        />
                        {errors.applicant_tlp && (
                            <p className="text-red-500">
                                {errors.applicant_tlp}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col py-3 space-y-3">
                        <Label htmlFor="applicant_adresse_email">
                            Email (optional)
                        </Label>
                        <Input
                            id="applicant_adresse_email"
                            value={data.applicant_adresse_email}
                            onChange={(e) =>
                                setData(
                                    "applicant_adresse_email",
                                    e.target.value
                                )
                            }
                            placeholder="Enter email"
                            className="w-full"
                        />
                        {errors.applicant_adresse_email && (
                            <p className="text-red-500">
                                {errors.applicant_adresse_email}
                            </p>
                        )}
                    </div>
                    {/* Date Fields */}
                    <div className="flex flex-col py-3 space-y-3">
                        <Label htmlFor="request_date">Request Date</Label>
                        <Input
                            id="request_date"
                            type="date"
                            value={data.request_date ? data.request_date.split(' ')[0] : ''} // Extracting the date part
                            onChange={(e) =>
                                setData("request_date", e.target.value)
                            }
                            className="w-full"
                        />
                        {errors.request_date && (
                            <p className="text-red-500">
                                {errors.request_date}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col py-3 space-y-3">
                        <Label htmlFor="required_by">Required By</Label>
                        <Input
                            id="required_by"
                            type="date"
                            value={data.required_by ? data.required_by.split(' ')[0] : ''} // Extracting the date part
                            onChange={(e) =>
                                setData("required_by", e.target.value)
                            }
                            className="w-full"
                        />
                        {errors.required_by && (
                            <p className="text-red-500">{errors.required_by}</p>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="domains">
                                Select Labs By Domain
                            </Label>
                            <Button
                                type="button"
                                onClick={handleAddDomains}
                                className="flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Select Labs By Domain
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
                            Select Labs By Establishment
                        </Label>

                        <Button
                            type="button"
                            onClick={handleAddLab}
                            className="flex items-center"
                        >
                            <FiPlus className="mr-2" />
                            Select Labs By Establishment
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
                    <div className="flex flex-col py-3 space-y-3">
                        <Label htmlFor="comments">Comments (optional)</Label>
                        <Textarea
                            id="comments"
                            value={data.comments}
                            onChange={(e) =>
                                setData("comments", e.target.value)
                            }
                            placeholder="Enter any comments"
                            className="w-full"
                        />
                        {errors.comments && (
                            <p className="text-red-500">{errors.comments}</p>
                        )}
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button type="submit" disabled={processing}>
                            Edit
                        </Button>
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

export default EditRequestServiceModal;
