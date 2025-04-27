import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useForm } from "@inertiajs/react";

const AddLabMemberModal = ({ onClose, isOpen, lab }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        acronym_team_name: "",
        Keywords: "",
        theme_description: "",
        sub_research_area: [],
    });

    const [subResearchArea, setSubResearchArea] = useState([]);

    const handleAddSubResearchArea = () => {
        setSubResearchArea([...subResearchArea, ""]);
    };

    const handleRemoveSubResearchArea = (index) => {
        const updatedSubResearchArea = [...subResearchArea];
        updatedSubResearchArea.splice(index, 1);
        setSubResearchArea(updatedSubResearchArea);

        const updatedResearches = [...data.sub_research_area];
        updatedResearches.splice(index, 1);
        setData("sub_research_area", updatedResearches);
    };

    const handleSubResearchAreaChange = (e, index) => {
        const updatedSubResearchArea = [...subResearchArea];
        updatedSubResearchArea[index] = e.target.value;
        setSubResearchArea(updatedSubResearchArea);

        const updatedResearches = [...data.sub_research_area];
        updatedResearches[index] = e.target.value;
        setData("sub_research_area", updatedResearches);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("lab.team.insert", { id: lab.id }), {
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
                    <DialogTitle>Edit Lab Member</DialogTitle>
                    <DialogDescription>
                        {/* Add additional description if needed */}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="mt-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="acronym_team_name">Acronym Team Name</Label>
                        <Input
                            id="acronym_team_name"
                            type="text"
                            value={data.acronym_team_name}
                            onChange={(e) => setData("acronym_team_name", e.target.value)}
                        />
                        <InputError message={errors.acronym_team_name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="Keywords">Keywords</Label>
                        <Input
                            id="Keywords"
                            type="text"
                            value={data.Keywords}
                            onChange={(e) => setData("Keywords", e.target.value)}
                        />
                        <InputError message={errors.Keywords} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="theme_description">Theme Description</Label>
                        <Textarea
                            id="theme_description"
                            value={data.theme_description}
                            onChange={(e) => setData("theme_description", e.target.value)}
                            className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows="4"
                        />
                        <InputError message={errors.theme_description} className="mt-2" />
                    </div>

                    <div className="mt-4 mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="sub_research_area">Sub Research Areas:</Label>
                            <Button
                                type="button"
                                onClick={handleAddSubResearchArea}
                                variant="outline"
                                className="flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Add Sub Research Areas
                            </Button>
                        </div>
                        <div>
                            <table className="w-full">
                                <tbody>
                                    {subResearchArea.map((result, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="py-2">
                                                <Input
                                                    type="text"
                                                    value={result}
                                                    onChange={(e) => handleSubResearchAreaChange(e, index)}
                                                    className="w-full"
                                                    placeholder="Enter Research Area"
                                                />
                                            </td>
                                            <td className="py-2 px-3 text-center">
                                                <Button
                                                    type="button"
                                                    onClick={() => handleRemoveSubResearchArea(index)}
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <InputError message={errors.sub_research_area} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button type="submit" disabled={processing}>
                            Add
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

export default AddLabMemberModal;
