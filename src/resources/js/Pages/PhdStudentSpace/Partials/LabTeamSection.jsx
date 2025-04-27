import React from "react";
import { BadgeCheckIcon, UserIcon } from "@heroicons/react/outline";


const LabTeamSection = ({ team, team_members }) => {


    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-semibold">Team Information</h3>
            </div>
            <div className="border-b border-gray-200 mb-4">
                <h4 className="text-lg font-semibold mb-2">{team.title}</h4>
                <p className="text-gray-700">
                    Location: {team.localisation}
                </p>
                <p className="text-gray-700">Members:</p>
                <ul className="list-disc pl-4">
                    {team_members.map((member, index) => (
                        <li
                            key={index}
                            className="flex items-center text-gray-700 mb-2"
                        >
                            {member.user.first_name} {member.user.last_name}
                            {team.team_leader_id === member.user_id ? (
                                <BadgeCheckIcon className="h-4 w-4 ml-1 text-green-500" />
                            ) : (
                                <UserIcon className="h-4 w-4 ml-1 text-gray-400" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
           
        </div>
    );
};

export default LabTeamSection;
