import React, { useEffect, useState, useContext } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { Checkbox } from "@/Components/ui/checkbox";
import { LanguageContext } from "@/lib/LanguageContext";

function EditUserDialog({ user, isOpen, onClose }) {
    const { language } = useContext(LanguageContext);
    const { data, setData, put } = useForm({
        isLabDirector: user.director === 1,
        isAdmin: user.is_admin === 1,
    });

    const [isAdmin, setIsAdmin] = useState(user.is_admin === 1);
    const [isLabDirector, setIsLabDirector] = useState(user.director === 1);

    // Update state and form data when isOpen prop changes
    useEffect(() => {
        setIsAdmin(user.is_admin === 1);
        setIsLabDirector(user.director === 1);
        setData("isAdmin", user.is_admin === 1);
        setData("isLabDirector", user.director === 1);
    }, [user, isOpen]);

    const handleAdminChange = (isChecked) => {
        setIsAdmin(isChecked);
        setData("isAdmin", isChecked);
    };

    const handleDirectorChange = (isChecked) => {
        setIsLabDirector(isChecked);
        setData("isLabDirector", isChecked);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("dashboard.users.edit", { id: user.id }), {
            isAdmin: data.isAdmin,
            isLabDirector: data.isLabDirector,
        });
        onClose(); // Close the dialog upon successful submission
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild></DialogTrigger>

            <DialogContent className="bg-white shadow-lg rounded-lg overflow-hidden">
                <DialogHeader className="bg-gray-100 py-4 px-6 rounded-t-lg">
                    <DialogTitle className="text-gray-800 text-lg font-semibold">
                        {language === "en" && (
                            <>Manage User: {user.first_name} {user.last_name}</>
                        )}
                        {language === "ar" && (
                            <>إدارة المستخدم: {user.first_name} {user.last_name}</>
                        )}
                        {language === "fr" && (
                            <>Gérer l'utilisateur: {user.first_name} {user.last_name}</>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        {language === "en" && <>Update user roles and permissions</>}
                        {language === "ar" && <>تحديث أدوار وصلاحيات المستخدم</>}
                        {language === "fr" && <>Mettre à jour les rôles et les permissions de l'utilisateur</>}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="flex items-center">
                            <Checkbox
                                id="adminCheckbox"
                                label={language === "en" ? "Admin" : language === "ar" ? "مدير" : "Administrateur"}
                                checked={isAdmin}
                                onCheckedChange={(isChecked) => handleAdminChange(isChecked)}
                                className="mr-2"
                            />
                            <span className="text-gray-800">
                                {language === "en" ? "Admin Privileges" : language === "ar" ? "صلاحيات المدير" : "Privilèges d'administrateur"}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <Checkbox
                                id="directorCheckbox"
                                label={language === "en" ? "Director" : language === "ar" ? "مدير" : "Directeur"}
                                checked={isLabDirector}
                                onCheckedChange={(isChecked) => handleDirectorChange(isChecked)}
                                className="mr-2"
                            />
                            <span className="text-gray-800">
                                {language === "en" ? "Director Privileges" : language === "ar" ? "صلاحيات المدير" : "Privilèges de directeur"}
                            </span>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="py-2 px-4 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors duration-300"
                            >
                                {language === "en" ? "Update" : language === "ar" ? "تحديث" : "Mettre à jour"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EditUserDialog;
