import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import {
    HiOutlineDocumentText,
    HiOutlineCode,
    HiOutlineViewGrid,
    HiOutlineUserCircle,
    HiOutlineLightBulb,
    HiOutlineTag,
    HiOutlineChartBar,
    HiOutlineAdjustments,
} from "react-icons/hi";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";

const icons = {
    Type: <HiOutlineDocumentText className="w-6 h-6 text-gray-600" />,
    Code: <HiOutlineCode className="w-6 h-6 text-gray-600" />,
    Title: <HiOutlineViewGrid className="w-6 h-6 text-gray-600" />,
    Problematic: <HiOutlineUserCircle className="w-6 h-6 text-gray-600" />,
    Reference: <HiOutlineDocumentText className="w-6 h-6 text-gray-600" />,
    Objective: <HiOutlineLightBulb className="w-6 h-6 text-gray-600" />,
    Expected_Results: <HiOutlineChartBar className="w-6 h-6 text-gray-600" />,
    Keywords: <HiOutlineTag className="w-6 h-6 text-gray-600" />,
    Methodology: <HiOutlineAdjustments className="w-6 h-6 text-gray-600" />,
    Material: <HiOutlineDocumentText className="w-6 h-6 text-gray-600" />,
    Project_Display: <HiOutlineViewGrid className="w-6 h-6 text-gray-600" />,
};

const formatList = (items) => {
    if (!items || !Array.isArray(items))
        return <p className="text-gray-900">No items</p>;
    return (
        <ul className="list-disc list-inside text-gray-900">
            {items.map((item, index) => (
                <li key={index} className="text-sm">
                    {item}
                </li>
            ))}
        </ul>
    );
};

const ProjectDetails = ({ project }) => {
    const details = {
        Type: project.type,
        Code: project.code,
        Title: project.title,
        Problematic: project.problematic,
        Reference: project.reference,
        Objective: project.objective,
        Expected_Results: project.expected_results
            ? JSON.parse(project.expected_results)
            : [],
        Keywords: project.keywords,
        Methodology: project.methodology,
        Material: project.material ? JSON.parse(project.material) : [],
    };

    const { delete: deleteRequest } = useForm();

    const handleDelete = () => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(
            `/director-space/manage-lab/delete-project/${project.id}`
        );
        onClose();
    };

   
    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                    Project Details
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route("lab.edit.project.index", project.id)}
                        >
                            <FiEdit className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition" />
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="bg-red-200 p-2 rounded hover:bg-red-300">
                                    <FiTrash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the project and
                                        remove the data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(details).map(([label, value]) => (
                        <div key={label} className="flex items-start space-x-4">
                            {icons[label]}
                            <div className="flex flex-col">
                                <Label className="text-gray-700 font-medium">
                                    {label}
                                </Label>
                                {Array.isArray(value)
                                    ? formatList(value)
                                    : label !== "Project_Display" && (
                                          <p className="text-gray-900 text-sm">
                                              {value}
                                          </p>
                                      )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectDetails;
