import React, { useState, useContext, useEffect } from "react";
import { Link, Head, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import Avatar from "@/Components/Avatar";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";

import { ChevronDown, ChevronUp, Trash, UserPlus, Edit } from "lucide-react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import AddTeamModal from "./Partials/Modals/AddTeamModal";
import EditTeamModal from "./Partials/Modals/EditTeamModal";
import DeleteTeamModal from "./Partials/Modals/DeleteTeamModal";
import DeleteMemberTeamModal from "./Partials/Modals/DeleteMemberTeamModal";

import { LanguageContext } from "@/lib/LanguageContext";
import { LogIn, Search } from "lucide-react";
import { Eye, Users, User, Tag, Book, Layers } from "lucide-react"; // Import icons from Lucide React
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";

const LabTeamSection = ({
    lab,
    lab_members,
    teams,
    labs,
    lab_members_all,
    auth,
    domains,
    userRole,
    notifications,
}) => {
    

    const { language } = useContext(LanguageContext);
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [showEditTeamModal, setShowEditTeamModal] = useState(false);
    const [collapsedTeams, setCollapsedTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedDetailsTeam, setSelectedDetailsTeam] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const [openDialog, setOpenDialog] = useState(false);

    const openAddModal = () => {
        setShowAddTeamModal(true);
    };

    const closeAddModal = () => {
        setShowAddTeamModal(false);
    };

    const openEditModal = (team) => {
        setSelectedTeam(team);
        setShowEditTeamModal(true);
    };

    const closeEditModal = () => {
        setShowEditTeamModal(false);
    };

    const toggleCollapse = (teamId) => {
        setCollapsedTeams((prevState) =>
            prevState.includes(teamId)
                ? prevState.filter((id) => id !== teamId)
                : [...prevState, teamId]
        );
    };

    const isTeamCollapsed = (teamId) => collapsedTeams.includes(teamId);

    const filteredTeams = teams.filter((team) =>
        team.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { delete: deleteRequest } = useForm();

    const handleDelete = (team) => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(`/director-space/manage-lab/delete-team/${team.id}`);
    };

    const handleDeleteMember = (team_member) => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(
            `/director-space/manage-lab/delete-team-member/${team_member.id}`
        );
    };

    const { props } = usePage();

    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Team Added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;
                case "To add another team ,you should change the type of this lab to research unit":
                    icon = <AlertCircle className="w-6 h-6 text-red-500" />;
                    variant = "default";
                    break;
                case "Team Deleted Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Team updated Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Member deleted Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                default:
                    icon = <AlertCircle className="w-6 h-6 text-yellow-500" />;
                    variant = "default";
                    break;
            }

            toast({
                variant,
                title: (
                    <div className="flex items-center space-x-2">
                        {icon}
                        <span>{props.flash.message}</span>
                    </div>
                ),

                action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
            });
        }
    }, [props]);

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="Manage Teams" />
            <SpaceLayout>
                <div className="flex justify-center mt-8 pb-16">
                    <div className="w-full max-w-6xl">
                        <div className="flex justify-end mb-4">
                            <Button onClick={openAddModal} className="bg-main">
                                <UserPlus className="w-5 h-5 mr-2" />
                                {language === "en"
                                    ? "Add Team"
                                    : language === "ar"
                                    ? "إضافة عضو"
                                    : "Ajouter un equipe"}
                            </Button>
                        </div>
                        <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
                            <CardHeader className="p-6 bg-gray-100 border-b border-gray-200 grid grid-cols-2 items-center">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        {language === "en"
                                            ? "All Teams"
                                            : language === "ar"
                                            ? "جميع المستخدمين"
                                            : "Tous les equipes"}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        {language === "en"
                                            ? "Recent Teams"
                                            : language === "ar"
                                            ? "المستخدمين الجدد"
                                            : "equipes"}
                                    </CardDescription>
                                </div>

                                <div className="text-right">
                                    <div className="relative flex-1 mb-4 sm:mb-0">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                                        <Input
                                            type="text"
                                            placeholder="Search by team title..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full rounded-full bg-white pl-8 pr-10 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>{" "}
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-4 bg-gray-50">
                                {filteredTeams.map((team) => (
                                    <Card
                                        key={team.id}
                                        className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white border-b border-gray-200">
                                            {/* Title and Localisation */}
                                            <div className="flex flex-col mb-4 sm:mb-0 pr-16">
                                                <div className="flex items-center space-x-3">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                            {team.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {team.localisation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-4 mt-4 sm:mt-0 pl-16">
                                                {/* View Details Action */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-green-600 hover:text-green-800"
                                                    onClick={() => {
                                                        setOpenDialog(true);
                                                        setSelectedDetailsTeam(
                                                            team
                                                        );
                                                    }}
                                                >
                                                    <Eye className="h-6 w-6" />
                                                </Button>

                                                {/* Edit Action */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() =>
                                                        openEditModal(team)
                                                    }
                                                >
                                                    <Edit className="h-6 w-6" />
                                                </Button>

                                                {/* Delete Action */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash className="h-6 w-6" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                {language ===
                                                                "en"
                                                                    ? "Are you absolutely sure?"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "هل أنت متأكد تمامًا؟"
                                                                    : "Êtes-vous absolument sûr?"}
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {language ===
                                                                "en"
                                                                    ? "This action cannot be undone. This will permanently delete the Lab Member and remove the data from our servers."
                                                                    : language ===
                                                                      "ar"
                                                                    ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنشأة بشكل دائم وإزالة البيانات من خوادمنا."
                                                                    : "Cette action est irréversible. Cela supprimera définitivement le membre du laboratoire et supprimera les données de nos serveurs."}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                {language ===
                                                                "en"
                                                                    ? "Cancel"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "إلغاء"
                                                                    : "Annuler"}
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        team
                                                                    )
                                                                }
                                                                className="bg-red-600 text-white hover:bg-red-700"
                                                            >
                                                                {language ===
                                                                "en"
                                                                    ? "Delete"
                                                                    : language ===
                                                                      "ar"
                                                                    ? "حذف"
                                                                    : "Supprimer"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardHeader>

                                        {!isTeamCollapsed(team.id) && (
                                            <CardContent className="p-4">
                                                <Table className="w-full">
                                                    <TableBody>
                                                        {team.team_member.map(
                                                            (member) => (
                                                                <TableRow
                                                                    key={
                                                                        member.id
                                                                    }
                                                                    className="hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    <TableCell className="p-4">
                                                                        <div className="flex items-center space-x-4">
                                                                            <Avatar
                                                                                user={
                                                                                    member.user
                                                                                }
                                                                                className="w-10 h-10 rounded-full"
                                                                            />
                                                                            <div>
                                                                                <div className="font-medium text-gray-900">
                                                                                    {
                                                                                        member
                                                                                            .user
                                                                                            .first_name
                                                                                    }{" "}
                                                                                    {
                                                                                        member
                                                                                            .user
                                                                                            .last_name
                                                                                    }
                                                                                </div>
                                                                                <div className="text-sm text-gray-500">
                                                                                    {
                                                                                        member
                                                                                            .user
                                                                                            .email
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="p-4 hidden sm:table-cell whitespace-nowrap font-semibold">
                                                                        {lab_members_all.map(
                                                                            (
                                                                                memb
                                                                            ) =>
                                                                                memb
                                                                                    ?.user
                                                                                    ?.id ===
                                                                                    member
                                                                                        ?.user
                                                                                        ?.id &&
                                                                                memb?.lab_id ===
                                                                                    lab?.id ? (
                                                                                    <div
                                                                                        key={
                                                                                            memb.id
                                                                                        }
                                                                                    >
                                                                                        <Badge className="text-xs text-white bg-main mx-2">
                                                                                            {
                                                                                                memb.member_rank
                                                                                            }
                                                                                        </Badge>
                                                                                    </div>
                                                                                ) : null
                                                                        )}
                                                                    </TableCell>

                                                                    <TableCell className="p-4 hidden md:table-cell">
  {lab_members_all.map((memb) =>
    memb?.user?.id === member?.user?.id && memb?.lab_id === lab?.id ? (
      <div key={memb.id} className="font-medium text-gray-900">
        {memb.team_leader === 1 && member?.team?.team_leader_id === memb?.user?.id ? (
          <Badge className="text-xs text-white bg-blue-700 mx-2">Team Leader</Badge>
        ) : (
          <Badge className="text-xs text-white bg-gray-500 mx-2">Member</Badge>
        )}
      </div>
    ) : null
  )}
</TableCell>


<TableCell className="p-4 hidden md:table-cell font-medium text-gray-900">
  {lab_members_all.map((memb) =>
    memb?.user?.id === member?.user?.id ? (
      <div key={memb.id}>
        {memb?.lab?.acronym_lab_name}
      </div>
    ) : null
  )}
</TableCell>

                                                                    <TableCell className="p-4 text-right space-x-2">
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger
                                                                                asChild
                                                                            >
                                                                                <Button
                                                                                    className="bg-red-200"
                                                                                    variant="outline"
                                                                                >
                                                                                    <TrashIcon className="w-5 h-5" />
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>
                                                                                        {language ===
                                                                                        "en"
                                                                                            ? "Are you absolutely sure?"
                                                                                            : language ===
                                                                                              "ar"
                                                                                            ? "هل أنت متأكد تمامًا؟"
                                                                                            : "Êtes-vous absolument sûr?"}
                                                                                    </AlertDialogTitle>

                                                                                    <AlertDialogDescription>
                                                                                        {language ===
                                                                                        "en"
                                                                                            ? "This action cannot be undone. This will permanently delete the Team Member and remove the data from our servers."
                                                                                            : language ===
                                                                                              "ar"
                                                                                            ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنشأة بشكل دائم وإزالة البيانات من خوادم                                                                                     نا."
                                                                                            : "Cette action est irréversible. Cela supprimera définitivement le membre du laboratoire et supprimera les données de nos serveurs."}
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>
                                                                                        {language ===
                                                                                        "en"
                                                                                            ? "Cancel"
                                                                                            : language ===
                                                                                              "ar"
                                                                                            ? "إلغاء"
                                                                                            : "Annuler"}
                                                                                    </AlertDialogCancel>
                                                                                    <AlertDialogAction
                                                                                        onClick={() =>
                                                                                            handleDeleteMember(
                                                                                                member
                                                                                            )
                                                                                        }
                                                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                                                    >
                                                                                        {language ===
                                                                                        "en"
                                                                                            ? "Delete"
                                                                                            : language ===
                                                                                              "ar"
                                                                                            ? "حذف"
                                                                                            : "Supprimer"}
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </CardContent>
                            {selectedDetailsTeam && (
                                <Dialog
                                    open={openDialog}
                                    onOpenChange={setOpenDialog}
                                    className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
                                >
                                    <DialogContent>
                                        <DialogHeader className="border-b border-gray-200 pb-4 mb-4">
                                            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                                                <Users className="h-6 w-6 text-main" />
                                                <span>
                                                    {language === "en"
                                                        ? "Team Details"
                                                        : language === "ar"
                                                        ? "تفاصيل الفريق"
                                                        : "Détails de l'équipe"}
                                                </span>
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            {/* Team Information */}
                                            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    <User className="h-8 w-8 text-main" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-800">
                                                        {
                                                            selectedDetailsTeam.title
                                                        }
                                                    </h4>
                                                    <p className="text-gray-600">
                                                        {
                                                            selectedDetailsTeam.localisation
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Additional Information */}
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Tag className="h-5 w-5 text-gray-500" />
                                                    <span className="font-medium text-gray-800">
                                                        {language === "en"
                                                            ? "Keywords:"
                                                            : language === "ar"
                                                            ? "الكلمات الرئيسية:"
                                                            : "Mots-clés:"}
                                                    </span>
                                                    <span>
                                                        {
                                                            selectedDetailsTeam.Keywords
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Book className="h-5 w-5 text-gray-500" />
                                                    <span className="font-medium text-gray-800">
                                                        {language === "en"
                                                            ? "Theme Description:"
                                                            : language === "ar"
                                                            ? "وصف الموضوع:"
                                                            : "Description du thème:"}
                                                    </span>
                                                    <p>
                                                        {
                                                            selectedDetailsTeam.theme_description
                                                        }
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Layers className="h-5 w-5 text-gray-500" />
                                                    <span className="font-medium text-gray-800">
                                                        {language === "en"
                                                            ? "Sub Research Area:"
                                                            : language === "ar"
                                                            ? "مجال البحث الفرعي:"
                                                            : "Domaine de recherche secondaire:"}
                                                    </span>
                                                    <p>
                                                        {JSON.parse(
                                                            selectedDetailsTeam.sub_research_area
                                                        ).map(
                                                            (theme, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                >
                                                                    {theme}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter className="flex justify-end space-x-4 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setOpenDialog(false);
                                                    setSelectedDetailsTeam(
                                                        null
                                                    );
                                                }}
                                                className="text-gray-700 hover:text-gray-900"
                                            >
                                                {language === "en"
                                                    ? "Close"
                                                    : language === "ar"
                                                    ? "إغلاق"
                                                    : "Fermer"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </Card>
                    </div>
                </div>
            </SpaceLayout>

            <AddTeamModal
                isOpen={showAddTeamModal}
                onClose={closeAddModal}
                lab={lab}
            />
            {showEditTeamModal && (
                <EditTeamModal
                    isOpen={showEditTeamModal}
                    onClose={closeEditModal}
                    team={selectedTeam}
                />
            )}
        </Layout>
    );
};

export default LabTeamSection;
