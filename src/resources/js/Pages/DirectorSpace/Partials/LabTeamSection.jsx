import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { UserPlusIcon, TrashIcon } from "lucide-react";

const LabTeamSection = ({ team, team_members }) => {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="bg-primary text-white">
                    <CardTitle className="text-lg">Team Members</CardTitle>
                    <Button variant="outline" onClick={() => setShowAddMemberModal(true)} className="ml-auto">
                        <UserPlusIcon className="w-5 h-5" />
                        <span className="ml-2">Add Member</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-4">
                        {team_members.map((member, index) => (
                            <li key={index} className="flex items-center space-x-2 py-2">
                                <span className="flex-1">{member.user.first_name} {member.user.last_name}</span>
                                {team.team_leader_id === member.user_id ? (
                                    <span className="text-green-500">Leader</span>
                                ) : (
                                    <span className="text-gray-500">Member</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={() => setShowDeleteTeamModal(true)} className="text-red-500">
                        <TrashIcon className="w-5 h-5" />
                        <span className="ml-2">Delete Team</span>
                    </Button>
                </CardFooter>
            </Card>

            {/* Add Member Modal */}
            <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>Add a new member to the team.</DialogDescription>
                </DialogHeader>
                <DialogContent>
                    {/* AddMemberModal Content */}
                </DialogContent>
            </Dialog>

            {/* Delete Team Modal */}
            <Dialog open={showDeleteTeamModal} onOpenChange={setShowDeleteTeamModal}>
                <DialogHeader>
                    <DialogTitle>Delete Team</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this team?</DialogDescription>
                </DialogHeader>
                <DialogContent>
                    {/* DeleteTeamModal Content */}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LabTeamSection;
