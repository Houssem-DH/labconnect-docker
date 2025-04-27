import AdminLayout from "@/Layouts/AdminLayout";
import { useEffect, useContext, useState } from "react";
import { LogIn, Search } from "lucide-react";
import Avatar from "@/Components/Avatar";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import CustomPagination from "@/utils/Pagination"; // Import the custom pagination component

import { useForm, Head } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";

import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";

import EditUserDialog from "@/Components/Admin/Dialog/EditUserDialog";

const Users = ({ users, auth }) => {
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        last_name: "",
        isLabDirector: selectedUser ? selectedUser.isLabDirector : false,
        isAdmin: selectedUser ? selectedUser.isAdmin : false,
    });

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedUser(null);
        setOpenDialog(false);
        

    };

    const [filterRole, setFilterRole] = useState("all"); // State for filtering role
    const [sortBy, setSortBy] = useState(""); // State for sorting
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    // Function to filter users based on role and search term
    const filteredUsers = users.data.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        if (
            (filterRole === "super_admin" && user.is_super_admin === 1) ||
            (filterRole === "admin" && user.is_admin === 1) ||
            (filterRole === "director" && user.director === 1) ||
            (filterRole === "user" &&
                user.is_super_admin === 0 &&
                user.is_admin === 0 &&
                user.director === 0) ||
            filterRole === "all"
        ) {
            return fullName.includes(search);
        }
        return false;
    });

    // Function to sort users based on selected criteria
    const sortedUsers = filteredUsers.sort((a, b) => {
        if (sortBy === "date") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "first_name") {
            return a.first_name.localeCompare(b.first_name);
        }
        return 0; // No sorting
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("register.admin"), {
            onSuccess: () => {
                setOpen(false);

                setData({
                    // Clear the form fields
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                });
            },
        });
    };

    return (
        <AdminLayout user={auth.user}>
            {language === "en" ? (
                <Head title="Users" />
            ) : language === "ar" ? (
                <Head title="المستخدمين" />
            ) : (
                <Head title="utilisateurs" />
            )}
            <div className="flex justify-center mt-8">
                <div className="w-full max-w-6xl">
                    <div className="text-right my-6">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    {" "}
                                    {language === "en"
                                        ? "Register New Admin"
                                        : language === "ar"
                                        ? "إنشاء مدير"
                                        : "Créer un administrateur"}
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Register New Admin
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className="text-gray-900">
                                    <form
                                        onSubmit={submit}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="grid gap-4">
                                            <Label htmlFor="email">
                                                {" "}
                                                {language === "en"
                                                    ? "First Name"
                                                    : language === "ar"
                                                    ? "اللقب"
                                                    : "Nom"}
                                            </Label>
                                            <Input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                value={data.first_name}
                                                autoComplete="first_name"
                                                placeholder={
                                                    language === "en"
                                                        ? "First Name"
                                                        : language === "ar"
                                                        ? "اللقب"
                                                        : "Nom"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "first_name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.first_name}
                                            />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label htmlFor="email">
                                                {language === "en"
                                                    ? "Last Name"
                                                    : language === "ar"
                                                    ? "الاسم"
                                                    : "Prenom"}
                                            </Label>
                                            <Input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={data.last_name}
                                                placeholder={
                                                    language === "en"
                                                        ? "Last Name"
                                                        : language === "ar"
                                                        ? "الاسم"
                                                        : "Prenom"
                                                }
                                                autoComplete="last_name"
                                                onChange={(e) =>
                                                    setData(
                                                        "last_name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.last_name}
                                            />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label htmlFor="email">
                                                {" "}
                                                {language === "en"
                                                    ? "Email"
                                                    : language === "ar"
                                                    ? "البريد الالكتروني"
                                                    : "Email"}
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder={
                                                    language === "en"
                                                        ? "Enter your email"
                                                        : language === "ar"
                                                        ? "أدخل بريدك الإلكتروني"
                                                        : "Tapez votre Email"
                                                }
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label htmlFor="password">
                                                {" "}
                                                {language === "en"
                                                    ? "Password"
                                                    : language === "ar"
                                                    ? "كلمة السر"
                                                    : "Mot de passe"}
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder={
                                                    language === "en"
                                                        ? "Enter your Password"
                                                        : language === "ar"
                                                        ? "أدخل كلمة السر"
                                                        : "Tapez votre mot de passe"
                                                }
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label htmlFor="password">
                                                {" "}
                                                {language === "en"
                                                    ? "Confirm Password"
                                                    : language === "ar"
                                                    ? "تأكيد  كلمة السر"
                                                    : "Confirmer Le Mot de passe"}
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={
                                                    data.password_confirmation
                                                }
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                placeholder={
                                                    language === "en"
                                                        ? "Confirm Password"
                                                        : language === "ar"
                                                        ? "تأكيد  كلمة السر"
                                                        : "Confirmer Le Mot de passe"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full  text-white "
                                            disabled={processing}
                                        >
                                            {language === "en"
                                                ? processing
                                                    ? "Registering..."
                                                    : "Register"
                                                : language === "ar"
                                                ? processing
                                                    ? "جاري انشاء الحساب"
                                                    : "انشاء الحساب"
                                                : processing
                                                ? "Inscrivez-vous..."
                                                : "Inscrivez-vous"}
                                        </Button>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <CardHeader className="p-6 bg-gray-50 border-b border-gray-200 grid grid-cols-2 items-center">
                            <div>
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    {language === "en"
                                        ? "All Users"
                                        : language === "ar"
                                        ? "جميع المستخدمين"
                                        : "Tous les utilisateurs"}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    {language === "en"
                                        ? "Recent Users"
                                        : language === "ar"
                                        ? "المستخدمين الجدد"
                                        : "Utilisateurs récents"}
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
                                                value="super_admin"
                                                onClick={() =>
                                                    handleFilterRoleChange(
                                                        "super_admin"
                                                    )
                                                }
                                            >
                                                {language === "en"
                                                    ? "Super Admins"
                                                    : language === "ar"
                                                    ? "مدراء عامون"
                                                    : "Super Admins"}
                                            </SelectItem>
                                            <SelectItem
                                                value="admin"
                                                onClick={() =>
                                                    handleFilterRoleChange(
                                                        "admin"
                                                    )
                                                }
                                            >
                                                {language === "en"
                                                    ? "Admins"
                                                    : language === "ar"
                                                    ? "مدراء"
                                                    : "Admins"}
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
                                                    ? "Directors"
                                                    : language === "ar"
                                                    ? "مديرون"
                                                    : "Directeurs"}
                                            </SelectItem>

                                            <SelectItem
                                                value="user"
                                                onClick={() =>
                                                    handleFilterRoleChange(
                                                        "user"
                                                    )
                                                }
                                            >
                                                {language === "en"
                                                    ? "Users"
                                                    : language === "ar"
                                                    ? "مستخدم"
                                                    : "Users"}
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
                                                    handleSortByChange("date")
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
                                                    ? "First Name"
                                                    : language === "ar"
                                                    ? "الاسم الأول"
                                                    : "Prénom"}
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
                                                setSearchTerm(e.target.value)
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
                                    {sortedUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            {/* Table cells */}
                                            <TableCell className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    {/* Avatar and user details */}
                                                    <Avatar
                                                        user={user}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {user.first_name}{" "}
                                                            {user.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4 hidden sm:table-cell">
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="p-4 hidden md:table-cell">
                                                {user.is_super_admin === 1 ? (
                                                    <Badge className="text-xs text-white bg-main">
                                                        Super Admin
                                                    </Badge>
                                                ) : user.is_admin === 1 ? (
                                                    <Badge className="text-xs text-white bg-blue-700">
                                                        Admin
                                                    </Badge>
                                                ) : user.director === 1 ? (
                                                    <Badge className="text-xs text-white bg-yellow-300">
                                                        Director
                                                    </Badge>
                                                ) : (
                                                    <Badge className="text-xs text-white bg-green-500">
                                                        User
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="p-4 text-right">
                                                {auth.user.id !== user.id && (
                                                    <>
                                                        <Button
                                                            className="bg-gray-200"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleOpenDialog(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            {language === "en"
                                                                ? "Manage"
                                                                : language ===
                                                                  "ar"
                                                                ? "إدارة"
                                                                : "Gérer"}
                                                        </Button>
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

                {selectedUser && (
                    <EditUserDialog user={selectedUser} isOpen={openDialog} onClose={handleCloseDialog} />
                )}
            </div>

            <CustomPagination data={users} routeName={"dashboard.users"} />
        </AdminLayout>
    );
};

export default Users;
