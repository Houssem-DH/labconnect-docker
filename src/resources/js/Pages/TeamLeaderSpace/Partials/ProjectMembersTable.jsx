import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FiTrash2, FiPlus } from "react-icons/fi";
import AddMemberModal from "./Modals/AddMemberToProjectModal";
import DeleteMemberModal from "./Modals/DeleteProjectMemberModal";
import DeleteNoMemberModal from "./Modals/DeleteNoProjectMemberModal";
import Avatar from "@/Components/Avatar";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/Components/ui/table";
import { HiOutlineUserGroup } from "react-icons/hi";

// Helper function to sort members, placing project leaders first
const sortMembers = (members) => {
    return [...members].sort((a, b) => {
        if (a.role === "Project Leader") return -1;
        if (b.role === "Project Leader") return 1;
        return 0;
    });
};

const TeamMembersTable = ({
    members,
    lab_members,
    labs,
    lab_members_all,
    project,
    isProjectLeader,
    externalMembers,
    noProjectMembers,
}) => {
    console.log(noProjectMembers);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isDeleteExternalModalOpen, setIsDeleteExternalModalOpen] =
        useState(false);
    const [selectedExternalMember, setSelectedExternalMember] = useState(null);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    const openDeleteModal = (member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openDeleteExternalModal = (member) => {
        setSelectedExternalMember(member);
        setIsDeleteExternalModalOpen(true);
    };
    const closeDeleteExternalModal = () => setIsDeleteExternalModalOpen(false);

    const sortedMembers = sortMembers(members);

    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                    <HiOutlineUserGroup className="w-6 h-6 mr-2 text-gray-600" />
                    Project Members
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="font-medium text-gray-600">
                                Member
                            </TableCell>
                            <TableCell className="font-medium text-gray-600">
                                Role
                            </TableCell>
                            <TableCell className="font-medium text-gray-600">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMembers.map((member) => (
                            <TableRow
                                key={member.id}
                                className="hover:bg-gray-50 transition duration-200"
                            >
                                <TableCell className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar
                                            user={member.user}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {member.user.first_name}{" "}
                                                {member.user.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {member.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4 text-gray-700">
                                    <div className="font-medium">
                                        {member.user.id ==
                                        project.project_leader_id ? (
                                            <Badge className="text-xs text-white bg-main">
                                                Project Leader
                                            </Badge>
                                        ) : (
                                            <Badge className="text-xs text-white bg-blue-700">
                                                Member
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                
                            </TableRow>
                        ))}
                        {Object.values(noProjectMembers).map((member) => (
                            <TableRow
                                key={member.user_id}
                                className="hover:bg-gray-50 transition duration-200"
                            >
                                <TableCell className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar
                                            user={member.user}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {member.user.first_name}{" "}
                                                {member.user.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {member.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4 text-gray-700">
                                    <div className="font-medium">External</div>
                                </TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Add modal component */}
            {isAddModalOpen && (
                <AddMemberModal
                    onClose={closeAddModal}
                    lab_members={lab_members}
                    labs={labs}
                    lab_members_all={lab_members_all}
                    externalMembers={externalMembers}
                    project={project}
                />
            )}

            {/* Delete modal */}
            {isDeleteModalOpen && (
                <DeleteMemberModal
                    onClose={closeDeleteModal}
                    member={selectedMember}
                />
            )}

            {/* Delete External Member modal */}
            {isDeleteExternalModalOpen && (
                <DeleteNoMemberModal
                    onClose={closeDeleteExternalModal}
                    member={selectedExternalMember}
                    project={project}
                />
            )}
        </Card>
    );
};

export default TeamMembersTable;
