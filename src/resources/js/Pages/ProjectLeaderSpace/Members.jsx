import React, { useState, useEffect, useContext } from "react";
import { useForm } from "@inertiajs/react";

import Avatar from "@/Components/Avatar";

import { Head } from "@inertiajs/react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { LogIn, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import {
    PencilAltIcon,
    TrashIcon,
   
} from "@heroicons/react/outline"; // Importing Heroicons icons
import { UserPlus, UserMinus } from "lucide-react"; // Importing Lucide-react icons
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/ProjectLeaderLayout";
import HeaderCard from "@/Components/HeaderCard";

import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";

import { LanguageContext } from "@/lib/LanguageContext";

import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";

const LabMembersSection = ({
    lab,
    lab_members,
    labs,
    lab_members_all,
    auth,
    teams,
    userRole,
    domains,
    specialities,
}) => {
    const { language } = useContext(LanguageContext);
    const { delete: deleteRequest } = useForm({});

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedMember2, setSelectedMember2] = useState(null);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openEditModal = (member) => {
        setShowEditModal(true);
        setSelectedMember(member);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedMember(null);
    };

    const openDeleteModal = (member) => {
        setSelectedMember2(member);
    };

    const closeDeleteModal = () => {
        setSelectedMember2(null);
    };

    const { props } = usePage();

    const [filterRole, setFilterRole] = useState("all"); // State for filtering role
    const [sortBy, setSortBy] = useState(""); // State for sorting
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    // Function to filter users based on role and search term
    const filteredMembers = lab_members.filter((member) => {
        const fullName =
            `${member.user.first_name} ${member.user.last_name}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        if (
            (filterRole === "director" && member.user.director === 1) ||
            (filterRole === "phd_student" && member.phd_student === 1) ||
            (filterRole === "project_leader" && member.project_leader === 1) ||
            (filterRole === "team_leader" && member.team_leader === 1) ||
            (filterRole === "member" &&
                member.phd_student === 0 &&
                member.project_leader === 0 &&
                member.team_leader === 0) ||
            filterRole === "all"
        ) {
            return fullName.includes(search);
        }
        return false;
    });

    // Function to sort users based on selected criteria
    const sortedMembers = filteredMembers.sort((a, b) => {
        if (sortBy === "date") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "first_name") {
            return a.user.first_name.localeCompare(b.user.first_name);
        }
        return 0; // No sorting
    });

    const handleDelete = (member) => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(
            `/director-space/manage-lab/delete-lab-member/${member.id}`
        );
    };

    

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Members" />
            <SpaceLayout>
                <div className="flex justify-center mt-8 pb-16">
                    <div className="w-full max-w-6xl">
                        
                        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <CardHeader className="p-6 bg-gray-50 border-b border-gray-200 grid grid-cols-2 items-center">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        {language === "en"
                                            ? "All Members"
                                            : language === "ar"
                                            ? "جميع المستخدمين"
                                            : "Tous les utilisateurs"}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        {language === "en"
                                            ? "Recent Members"
                                            : language === "ar"
                                            ? "المستخدمين الجدد"
                                            : "Utilisateurs"}
                                    </CardDescription>
                                </div>

                                <div className="text-right">
                                    {/* Filter and sort controls */}
                                    <div className="flex items-center space-x-4 justify-end">
                                        {/* Role filter dropdown */}
                                        <Select onValueChange={setFilterRole}>
                                            <SelectTrigger>
                                                <SelectValue
                                                    value={filterRole}
                                                    placeholder={
                                                        language === "en"
                                                            ? "All Roles"
                                                            : language === "ar"
                                                            ? "كل الأدوار"
                                                            : "Tous les rôles"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="all" // Example value to represent "All Roles"
                                                    onClick={() =>
                                                        handleFilterRoleChange(
                                                            "all"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "All Roles"
                                                        : language === "ar"
                                                        ? "كل الأدوار"
                                                        : "Tous les rôles"}
                                                </SelectItem>
                                                <SelectItem
                                                    value="director"
                                                    onClick={() =>
                                                        handleFilterRoleChange(
                                                            "director"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Director"
                                                        : language === "ar"
                                                        ? "مدراء عامون"
                                                        : "Director"}
                                                </SelectItem>
                                                <SelectItem
                                                    value="team_leader"
                                                    onClick={() =>
                                                        handleFilterRoleChange(
                                                            "team_leader"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Team Leaders"
                                                        : language === "ar"
                                                        ? "مدراء"
                                                        : "Team Leaders"}
                                                </SelectItem>
                                                <SelectItem
                                                    value="project_leader"
                                                    onClick={() =>
                                                        handleFilterRoleChange(
                                                            "project_leader"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Project Leaders"
                                                        : language === "ar"
                                                        ? "مديرون"
                                                        : "Project Leaders"}
                                                </SelectItem>

                                                <SelectItem
                                                    value="phd_student"
                                                    onClick={() =>
                                                        handleFilterRoleChange(
                                                            "phd_student"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Phd Student"
                                                        : language === "ar"
                                                        ? "مديرون"
                                                        : "Phd Student"}
                                                </SelectItem>

                                                <SelectItem
                                                    value="member"
                                                    onClick={() =>
                                                        handleFilterRoleChange(
                                                            "member"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Members"
                                                        : language === "ar"
                                                        ? "مستخدم"
                                                        : "Members"}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {/* Sort by dropdown */}
                                        <Select onValueChange={setSortBy}>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        language === "en"
                                                            ? "Sort By"
                                                            : language === "ar"
                                                            ? "فرز بواسطة"
                                                            : "Trier par"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="default" // Example value to represent "Sort By"
                                                    onClick={() =>
                                                        handleSortByChange("")
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Sort By"
                                                        : language === "ar"
                                                        ? "فرز بواسطة"
                                                        : "Trier par"}
                                                </SelectItem>
                                                <SelectItem
                                                    value="date"
                                                    onClick={() =>
                                                        handleSortByChange(
                                                            "date"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Date"
                                                        : language === "ar"
                                                        ? "التاريخ"
                                                        : "Date"}
                                                </SelectItem>
                                                <SelectItem
                                                    value="first_name"
                                                    onClick={() =>
                                                        handleSortByChange(
                                                            "first_name"
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Name"
                                                        : language === "ar"
                                                        ? "الاسم الأول"
                                                        : "Nom"}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {/* Search input */}
                                        <div className="relative ml-auto flex-1 md:grow-0">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder={
                                                    language === "en"
                                                        ? "Search by first or last name..."
                                                        : language === "ar"
                                                        ? "ابحث باسم الأول أو الأخير..."
                                                        : "Rechercher par prénom ou nom de famille..."
                                                }
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6">
                                <Table className="w-full">
                                    <TableBody>
                                        {sortedMembers.map((member) => (
                                            <TableRow
                                                key={member.id}
                                                className="hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <TableCell className="p-4">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar
                                                            user={member.user}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {
                                                                    member.user
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    member.user
                                                                        .last_name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    member.user
                                                                        .email
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4 hidden sm:table-cell whitespace-nowrap font-semibold">
                                                    {member.member_rank}
                                                </TableCell>

                                                <TableCell className="p-4 hidden md:table-cell">
                                                    {member.user.director ===
                                                        1 && (
                                                        <Badge className="text-xs text-white bg-main mx-2">
                                                            Director
                                                        </Badge>
                                                    )}
                                                    {member.team_leader ===
                                                        1 && (
                                                        <Badge className="text-xs text-white bg-blue-700 mx-2">
                                                            Team Leader
                                                        </Badge>
                                                    )}
                                                    {member.project_leader ===
                                                    1 ? (
                                                        <Badge className="text-xs text-white bg-yellow-300 mx-2">
                                                            Project Leader
                                                        </Badge>
                                                    ) : (
                                                        <>
                                                            {member.phd_student ===
                                                                1 &&
                                                            member.team_leader !=
                                                                1 &&
                                                            member.project_leader !=
                                                                1 ? (
                                                                <Badge className="text-xs text-white bg-yellow-300 mx-2">
                                                                    PhD Student
                                                                </Badge>
                                                            ) : member.researcher ===
                                                                  1 &&
                                                              member.team_leader !=
                                                                  1 &&
                                                              member.project_leader !=
                                                                  1 ? (
                                                                <Badge className="text-xs text-white bg-green-500 mx-2">
                                                                    Researcher
                                                                </Badge>
                                                            ) : member.associated_researcher ===
                                                                  1 &&
                                                              member.team_leader !=
                                                                  1 &&
                                                              member.project_leader !=
                                                                  1 ? (
                                                                <Badge className="text-xs text-white bg-indigo-500 mx-2">
                                                                    Associated
                                                                    Researcher
                                                                </Badge>
                                                            ) : (
                                                                <>
                                                                    {member.member ===
                                                                        1 &&
                                                                        member.team_leader !=
                                                                            1 &&
                                                                        member.project_leader !=
                                                                            1 && (
                                                                            <Badge className="text-xs text-white bg-gray-500 mx-2">
                                                                                Member
                                                                            </Badge>
                                                                        )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </TableCell>
                                                
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SpaceLayout>

  
        </Layout>
    );
};

export default LabMembersSection;
