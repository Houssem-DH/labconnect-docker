import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FiTrash2 } from "react-icons/fi";
import AddMemberModal from "./Modals/AddMemberToScModal";
import DeleteMemberModal from "./Modals/DeleteScMemberModal";
import DeleteNoMemberModal from "./Modals/DeleteNoScMemberModal";
import Avatar from "@/Components/Avatar";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/Components/ui/table";

const TeamMembersTable = ({
    members,
    lab_members,
    labs,
    lab_members_all,
    sc,
    noTeamMembers,
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isNoDeleteModalOpen, setIsNoDeleteModalOpen] = useState(false);
    const [selectedNoMember, setSelectedNoMember] = useState(null);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    const openDeleteModal = (member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openNoDeleteModal = (member) => {
        setSelectedNoMember(member);
        setIsNoDeleteModalOpen(true);
    };
    const closeNoDeleteModal = () => setIsNoDeleteModalOpen(false);

    // Decode external authors JSON
    const externalAuthors = sc.external_author
        ? JSON.parse(sc.external_author)
        : [];

    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                    Authors
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex justify-end mb-6">
                    <Button onClick={openAddModal}>Add Author</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="font-medium text-gray-600">
                                #
                            </TableCell>
                            <TableCell className="font-medium text-gray-600">
                                Name
                            </TableCell>
                            <TableCell className="font-medium text-gray-600">
                                Email
                            </TableCell>
                            <TableCell className="font-medium text-gray-600">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Display Lab Members */}
                        {members.map((member) => (
                            <TableRow
                                key={member.id}
                                className="hover:bg-gray-50"
                            >
                                <TableCell className="p-4">
                                    <Avatar
                                        user={member}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </TableCell>
                                <TableCell className="p-4 text-gray-900">
                                    {member.first_name} {member.last_name}
                                </TableCell>
                                <TableCell className="p-4 text-gray-500">
                                    {member.email}
                                </TableCell>
                                <TableCell className="p-4 text-red-500 flex items-center space-x-2">
                                    <FiTrash2
                                        className="w-5 h-5 cursor-pointer hover:text-red-700"
                                        onClick={() => openDeleteModal(member)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Display External Authors */}
                        {externalAuthors.map((author, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                                <TableCell className="p-4">
                                    {/* External members may not have avatars */}
                                </TableCell>
                                <TableCell className="p-4 text-gray-900">
                                    {author}
                                </TableCell>
                                <TableCell className="p-4 text-gray-500">
                                    {/* No email for external members */}
                                    N/A
                                </TableCell>
                                <TableCell className="p-4 text-red-500 flex items-center space-x-2">
                                    <FiTrash2
                                        className="w-5 h-5 cursor-pointer hover:text-red-700"
                                        onClick={() =>
                                            openNoDeleteModal(author)
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Add Member Modal */}
                {isAddModalOpen && (
                    <AddMemberModal
                        onClose={closeAddModal}
                        lab_members={lab_members}
                        labs={labs}
                        lab_members_all={lab_members_all}
                        production={sc}
                    />
                )}

                {/* Delete Lab Member Modal */}
                {isDeleteModalOpen && (
                    <DeleteMemberModal
                        isOpen={isDeleteModalOpen}
                        onClose={closeDeleteModal}
                        sc={sc}
                        member={selectedMember}
                    />
                )}

                {/* Delete External Author Modal */}
                {isNoDeleteModalOpen && (
                    <DeleteNoMemberModal
                    isOpen={isNoDeleteModalOpen}
                        onClose={closeNoDeleteModal}
                        sc={sc}
                        author={selectedNoMember}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default TeamMembersTable;
