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

const CreateProject = ({
    onClose,
    isOpen,
    lab,
    lab_members,
    lab_members_all,
    labs,
    project,
    establishments,
    doms,
}) => {
    const { language } = useContext(LanguageContext);

    const { data, setData, put, errors, reset } = useForm({
        project_leader_id: project.project_leader_id,
        type: project.type,
        code: project.code,
        title: project.title,
        problematic: project.problematic,
        methodology: project.methodology,
        reference: project.reference,
        objective: project.objective,
        expected_results: JSON.parse(project.expected_results || '[]'),
        keywords: project.keywords,

        material: JSON.parse(project.material || '[]'),
        project_display: project.project_display,
    });

    const options = lab_members
        .filter((member) => member.project_leader)
        .map((member) => ({
            value: member.user_id,
            label: `${member.user.first_name} ${member.user.last_name}`,
        }));

        const [expectedResults, setExpectedResults] = useState(() => {
            console.log("Initializing expectedResults:", data.expected_results);
            return Array.isArray(data.expected_results) ? data.expected_results : [];
        });
        const [materials, setMaterials] = useState(() => {
            console.log("Initializing materials:", data.material);
            return Array.isArray(data.material) ? data.material : [];
        });

    const handleAddExpectedResults = () => {
        setExpectedResults([...expectedResults, ""]);
    };

    const handleRemoveExpectedResults = (index) => {
        const updatedExpectedResults = [...expectedResults];
        updatedExpectedResults.splice(index, 1);
        setExpectedResults(updatedExpectedResults);

        const updatedResults = [...data.expected_results];
        updatedResults.splice(index, 1);
        setData("expected_results", updatedResults);
    };

    const handleExpectedResultsChange = (e, index) => {
        const updatedExpectedResults = [...expectedResults];
        updatedExpectedResults[index] = e.target.value;
        setExpectedResults(updatedExpectedResults);

        const updatedResults = [...data.expected_results];
        updatedResults[index] = e.target.value;
        setData("expected_results", updatedResults);
    };

    const handleAddMaterials = () => {
        setMaterials([...materials, ""]);
    };

    const handleRemoveMaterials = (index) => {
        const updatedMaterials = [...materials];
        updatedMaterials.splice(index, 1);
        setMaterials(updatedMaterials);

        const updatedMat = [...data.material];
        updatedMat.splice(index, 1);
        setData("material", updatedMat);
    };

    const handleMaterialsChange = (e, index) => {
        const updatedMaterials = [...materials];
        updatedMaterials[index] = e.target.value;
        setMaterials(updatedMaterials);

        const updatedMat = [...data.material];
        updatedMat[index] = e.target.value;
        setData("material", updatedMat);
    };

    const handleLeaderChange = (selectedOption) => {
        setData(
            "project_leader_id",
            selectedOption ? selectedOption.value : ""
        );
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("collaboration.space.project.edit", { id: project.id }), {
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
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        {/* Add additional description if needed */}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="mb-8">
                        <Label htmlFor="project_leader_id">
                            Project Leader *
                        </Label>
                        <Select
                            id="project_leader_id"
                            name="project_leader_id"
                            styles={customStyles}
                            value={options.find(
                                (option) =>
                                    option.value === data.project_leader_id
                            )}
                            onChange={handleLeaderChange}
                            options={options}
                            placeholder="Select Project Leader"
                            className="mt-1 block w-full"
                            isDisabled
                        />
                    </div>
                    <div className="mb-8">
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            name="type"
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            placeholder="Enter type"
                            className="mt-1 block w-full"
                        />
                        {errors.type && (
                            <p className="text-red-500 mt-2">{errors.type}</p>
                        )}
                    </div>
                    <div className="mb-8">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            name="code"
                            value={data.code}
                            onChange={(e) => setData("code", e.target.value)}
                            placeholder="Enter code"
                            className="mt-1 block w-full"
                        />
                        {errors.code && (
                            <p className="text-red-500 mt-2">{errors.code}</p>
                        )}
                    </div>
                    <div className="mb-8">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Enter title"
                            className="mt-1 block w-full"
                        />
                        {errors.title && (
                            <p className="text-red-500 mt-2">{errors.title}</p>
                        )}
                    </div>
                    <div className="mb-8">
                        <Label htmlFor="problematic">Problematic</Label>
                        <Textarea
                            id="problematic"
                            name="problematic"
                            value={data.problematic}
                            onChange={(e) =>
                                setData("problematic", e.target.value)
                            }
                            placeholder="Enter problematic"
                            className="mt-1 block w-full border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        {errors.problematic && (
                            <p className="text-red-500 mt-2">
                                {errors.problematic}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <Label htmlFor="methodology">Methodology</Label>
                        <Textarea
                            id="methodology"
                            name="methodology"
                            value={data.methodology}
                            onChange={(e) =>
                                setData("methodology", e.target.value)
                            }
                            placeholder="Enter methodology"
                            className="mt-1 block w-full border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        {errors.methodology && (
                            <p className="text-red-500 mt-2">
                                {errors.methodology}
                            </p>
                        )}
                    </div>
                    <div className="mb-8">
                        <Label htmlFor="reference">Reference</Label>
                        <Input
                            id="reference"
                            name="reference"
                            value={data.reference}
                            onChange={(e) =>
                                setData("reference", e.target.value)
                            }
                            placeholder="Enter reference"
                            className="mt-1 block w-full"
                        />
                        {errors.reference && (
                            <p className="text-red-500 mt-2">
                                {errors.reference}
                            </p>
                        )}
                    </div>
                    <div className="mb-8">
                        <Label htmlFor="objective">Objective</Label>
                        <Textarea
                            id="objective"
                            name="objective"
                            value={data.objective}
                            onChange={(e) =>
                                setData("objective", e.target.value)
                            }
                            placeholder="Enter objective"
                            className="mt-1 block w-full border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        {errors.objective && (
                            <p className="text-red-500 mt-2">
                                {errors.objective}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between p-4">
                            <Label htmlFor="expected_results">
                                Expected Results
                            </Label>
                            <Button
                                type="button"
                                onClick={handleAddExpectedResults}
                                className="flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Add Expected Result
                            </Button>
                        </div>
                        {expectedResults.map((result, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <Input
                                    type="text"
                                    value={result}
                                    onChange={(e) =>
                                        handleExpectedResultsChange(e, index)
                                    }
                                    placeholder="Enter expected result"
                                    className="mr-2 w-full"
                                />
                                <Button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveExpectedResults(index)
                                    }
                                    variant="destructive"
                                    className="flex items-center justify-center"
                                >
                                    <FiTrash2 className="text-white" />
                                </Button>
                            </div>
                        ))}
                        {errors.expected_results && (
                            <p className="text-red-500 mt-2">
                                {errors.expected_results}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between  p-4">
                            <Label htmlFor="material">Material</Label>
                            <Button
                                type="button"
                                onClick={handleAddMaterials}
                                className="flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Add Material
                            </Button>
                        </div>
                        {materials.map((material, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <Input
                                    type="text"
                                    value={material}
                                    onChange={(e) =>
                                        handleMaterialsChange(e, index)
                                    }
                                    placeholder="Enter material"
                                    className="mr-2 w-full"
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveMaterials(index)}
                                    variant="destructive"
                                    className="flex items-center justify-center"
                                >
                                    <FiTrash2 className="text-white" />
                                </Button>
                            </div>
                        ))}
                        {errors.material && (
                            <p className="text-red-500 mt-2">
                                {errors.material}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                            id="keywords"
                            name="keywords"
                            value={data.keywords}
                            onChange={(e) =>
                                setData("keywords", e.target.value)
                            }
                            placeholder="Enter keywords"
                            className="mt-1 block w-full"
                        />
                        {errors.keywords && (
                            <p className="text-red-500 mt-2">
                                {errors.keywords}
                            </p>
                        )}
                    </div>

                    <div className=" mb-8 flex items-center">
                        <Checkbox
                            id="project_display"
                            checked={data.project_display}
                            onCheckedChange={(checked) =>
                                setData("project_display", checked)
                            }
                        />
                        <Label htmlFor="project_display" className="ml-2">
                            Display in Project Listings
                        </Label>
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button type="submit">Edit</Button>
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

export default CreateProject;
