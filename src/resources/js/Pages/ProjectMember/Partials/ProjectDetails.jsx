import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
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

    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
             <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
             <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                    <HiOutlineViewGrid className="w-8 h-8 text-gray-700" />
                    Project Details
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
