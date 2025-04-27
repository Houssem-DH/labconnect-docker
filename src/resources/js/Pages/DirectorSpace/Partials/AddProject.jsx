import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { FiTrash2, FiPlus, FiChevronRight } from "react-icons/fi";
import { Link, Head } from "@inertiajs/react";
import Select from "react-select";
import { customStyles } from "@/styles";
import { Checkbox } from "@/Components/ui/checkbox"; // Assuming you have a Checkbox component in Shadcn UI

const AddProject = ({ auth, userRole, lab, lab_members }) => {
    const { data, setData, post, errors } = useForm({
        project_leader_id: "",
        type: "",
        code: "",
        title: "",
        problematic: "",
        reference: "",
        objective: "",
        expected_results: [],
        keywords: "",
        methodology: "",
        material: [],
        project_display: false,
    });

    const options = lab_members
        .filter((member) => member.project_leader)
        .map((member) => ({
            value: member.user_id,
            label: `${member.user.first_name} ${member.user.last_name}`,
        }));

    const [expectedResults, setExpectedResults] = useState([]);
    const [materials, setMaterials] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lab.projects.insert", { id: lab.id }));
    };

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Add Project" />
            <SpaceLayout>
                <div className="flex justify-center items-center text-gray-600 max-w-5xl w-full overflow-hidden">
                    <FiChevronRight className="w-5 h-5" />
                    <Link
                        href="/director-space/projects"
                        className="ml-2 font-semibold hover:text-gray-900"
                    >
                        Projects
                    </Link>
                    <FiChevronRight className="mx-2 w-5 h-5" />
                    <span className="font-semibold cursor-default">
                        Add Project
                    </span>
                </div>
                <div className="flex justify-center items-center h-full pb-24 pt-12">
                    <div className="max-w-5xl w-full">
                        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <CardHeader className="bg-gray-100 text-black p-6">
                                <CardTitle className="text-2xl font-bold">
                                    Add Project
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit}>
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
                                                    option.value ===
                                                    data.project_leader_id
                                            )}
                                            onChange={handleLeaderChange}
                                            options={options}
                                            placeholder="Select Project Leader"
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                    <div className="mb-8">
                                        <Label htmlFor="type">Type</Label>
                                        <Input
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                            placeholder="Enter type"
                                            className="mt-1 block w-full"
                                        />
                                        {errors.type && (
                                            <p className="text-red-500 mt-2">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-8">
                                        <Label htmlFor="code">Code</Label>
                                        <Input
                                            id="code"
                                            name="code"
                                            value={data.code}
                                            onChange={(e) =>
                                                setData("code", e.target.value)
                                            }
                                            placeholder="Enter code"
                                            className="mt-1 block w-full"
                                        />
                                        {errors.code && (
                                            <p className="text-red-500 mt-2">
                                                {errors.code}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-8">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            placeholder="Enter title"
                                            className="mt-1 block w-full"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 mt-2">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-8">
                                        <Label htmlFor="problematic">
                                            Problematic
                                        </Label>
                                        <Textarea
                                            id="problematic"
                                            name="problematic"
                                            value={data.problematic}
                                            onChange={(e) =>
                                                setData(
                                                    "problematic",
                                                    e.target.value
                                                )
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
                                        <Label htmlFor="reference">
                                            Reference
                                        </Label>
                                        <Input
                                            id="reference"
                                            name="reference"
                                            value={data.reference}
                                            onChange={(e) =>
                                                setData(
                                                    "reference",
                                                    e.target.value
                                                )
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
                                        <Label htmlFor="methodology">
                                            Methodology
                                        </Label>
                                        <Input
                                            id="methodology"
                                            name="methodology"
                                            value={data.methodology}
                                            onChange={(e) =>
                                                setData(
                                                    "methodology",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter methodology"
                                            className="mt-1 block w-full"
                                        />
                                        {errors.methodology && (
                                            <p className="text-red-500 mt-2">
                                                {errors.methodology}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-8">
                                        <Label htmlFor="objective">
                                            Objective
                                        </Label>
                                        <Textarea
                                            id="objective"
                                            name="objective"
                                            value={data.objective}
                                            onChange={(e) =>
                                                setData(
                                                    "objective",
                                                    e.target.value
                                                )
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
                                        <div className="flex justify-between mb-2">
                                            <Label htmlFor="expected_results">
                                                Expected Results
                                            </Label>
                                            <Button
                                                type="button"
                                                onClick={
                                                    handleAddExpectedResults
                                                }
                                                className="flex items-center"
                                            >
                                                <FiPlus className="mr-2" />
                                                Add Expected Result
                                            </Button>
                                        </div>
                                        {expectedResults.map(
                                            (result, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center mb-2"
                                                >
                                                    <Input
                                                        type="text"
                                                        value={result}
                                                        onChange={(e) =>
                                                            handleExpectedResultsChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                        placeholder="Enter expected result"
                                                        className="mr-2 w-full"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveExpectedResults(
                                                                index
                                                            )
                                                        }
                                                        variant="destructive"
                                                        className="flex items-center justify-center"
                                                    >
                                                        <FiTrash2 className="text-white" />
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        {errors.expected_results && (
                                            <p className="text-red-500 mt-2">
                                                {errors.expected_results}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex justify-between mb-2">
                                            <Label htmlFor="material">
                                                Material
                                            </Label>
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
                                            <div
                                                key={index}
                                                className="flex items-center mb-2"
                                            >
                                                <Input
                                                    type="text"
                                                    value={material}
                                                    onChange={(e) =>
                                                        handleMaterialsChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    placeholder="Enter material"
                                                    className="mr-2 w-full"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveMaterials(
                                                            index
                                                        )
                                                    }
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
                                        <Label htmlFor="keywords">
                                            Keywords
                                        </Label>
                                        <Input
                                            id="keywords"
                                            name="keywords"
                                            value={data.keywords}
                                            onChange={(e) =>
                                                setData(
                                                    "keywords",
                                                    e.target.value
                                                )
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
                                                setData(
                                                    "project_display",
                                                    checked
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="project_display"
                                            className="ml-2"
                                        >
                                            Display in Project Listings
                                        </Label>
                                    </div>

                                    <div className="mt-8">
                                        <Button
                                            type="submit"
                                            className="bg-main text-white w-full py-3 rounded-lg hover:bg-main focus:bg-main transition-colors"
                                        >
                                            Submit Project
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default AddProject;
