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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import CustomPagination from "@/utils/Pagination"; // Import the custom pagination component

import { useForm, Head } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";

import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";

const Users = ({ users, auth }) => {
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        delete: deleteRequest,
    } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        last_name: "",
        lab_type: "lab", // Default value set to "lab"
    });

    const [type, setType] = useState(null); // State for filtering role

    const [filterRole, setFilterRole] = useState("all"); // State for filtering role
    const [sortBy, setSortBy] = useState(""); // State for sorting
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    // Function to filter users based on role and search term
    const filteredUsers = users.data.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const search = searchTerm.toLowerCase();

        return fullName.includes(search);
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

        post(route("admin.dashboard.register.director"), {
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

    // Function to handle delete action
    const handleDelete = (director) => {
        // Send delete requdirector to the backend
        deleteRequest(`/dashboard/admin/directors/delete/${director.id}`);
    };

    return (
        <AdminLayout user={auth.user}>
            {language === "en" ? (
                <Head title="Directors" />
            ) : language === "ar" ? (
                <Head title="المستخدمين" />
            ) : (
                <Head title="Directeurs" />
            )}
            <div className="flex justify-center mt-8">
                <div className="w-full max-w-6xl">
                    <div className="text-right my-6">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="  text-white hover:from-green-500 hover:to-red-900 transition-all duration-300 rounded-lg px-4 py-2">
                                    {language === "en"
                                        ? "Create a new Lab"
                                        : language === "ar"
                                        ? "إنشاء مدير"
                                        : "Créer un Directeur"}
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-gray-900">
                                        {language === "en"
                                            ? "Create New Lab"
                                            : language === "ar"
                                            ? "تسجيل مدير جديد"
                                            : "Enregistrer un Nouveau Directeur"}
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600 font-semibold">
                                        Fill out the form below to register a
                                        new director and lab.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-6">
                                    <form
                                        onSubmit={submit}
                                        className="space-y-6"
                                    >
                                        {/* Director Information Section */}
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-2">
                                                Director Information:
                                            </h4>
                                            <div className="grid gap-4">
                                                <div>
                                                    <Label
                                                        htmlFor="first_name"
                                                        className="text-gray-700"
                                                    >
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
                                                                : language ===
                                                                  "ar"
                                                                ? "اللقب"
                                                                : "Nom"
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "first_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border border-gray-300 rounded-lg"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.first_name
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <Label
                                                        htmlFor="last_name"
                                                        className="text-gray-700"
                                                    >
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
                                                        autoComplete="last_name"
                                                        placeholder={
                                                            language === "en"
                                                                ? "Last Name"
                                                                : language ===
                                                                  "ar"
                                                                ? "الاسم"
                                                                : "Prenom"
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "last_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border border-gray-300 rounded-lg"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.last_name
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <Label
                                                        htmlFor="email"
                                                        className="text-gray-700"
                                                    >
                                                        {language === "en"
                                                            ? "Email"
                                                            : language === "ar"
                                                            ? "البريد الإلكتروني"
                                                            : "Email"}
                                                    </Label>
                                                    <Input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={data.email}
                                                        autoComplete="email"
                                                        placeholder={
                                                            language === "en"
                                                                ? "Enter your email"
                                                                : language ===
                                                                  "ar"
                                                                ? "أدخل بريدك الإلكتروني"
                                                                : "Tapez votre Email"
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "email",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border border-gray-300 rounded-lg"
                                                        required
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Password Section */}
                                        <div className="grid gap-4">
                                            <div>
                                                <Label
                                                    htmlFor="password"
                                                    className="text-gray-700"
                                                >
                                                    {language === "en"
                                                        ? "Password"
                                                        : language === "ar"
                                                        ? "كلمة السر"
                                                        : "Mot de passe"}
                                                </Label>
                                                <Input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    value={data.password}
                                                    placeholder={
                                                        language === "en"
                                                            ? "Enter your Password"
                                                            : language === "ar"
                                                            ? "أدخل كلمة السر"
                                                            : "Tapez votre mot de passe"
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded-lg"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="password_confirmation"
                                                    className="text-gray-700"
                                                >
                                                    {language === "en"
                                                        ? "Confirm Password"
                                                        : language === "ar"
                                                        ? "تأكيد كلمة السر"
                                                        : "Confirmer Le Mot de passe"}
                                                </Label>
                                                <Input
                                                    type="password"
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    placeholder={
                                                        language === "en"
                                                            ? "Confirm Password"
                                                            : language === "ar"
                                                            ? "تأكيد كلمة السر"
                                                            : "Confirmer Le Mot de passe"
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded-lg"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Lab Information Section */}
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-2">
                                                Lab Information:
                                            </h4>
                                            <div className="grid gap-4">
                                                <div>
                                                    <Label
                                                        htmlFor="type"
                                                        className="text-gray-700"
                                                    >
                                                        {language === "en"
                                                            ? "Type"
                                                            : language === "ar"
                                                            ? "نوع"
                                                            : "Type"}
                                                    </Label>
                                                    <Select
                                                        id="type"
                                                        name="type"
                                                        value={data.lab_type}
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            setData(
                                                                "lab_type",
                                                                value
                                                            );
                                                            setType(value);
                                                        }}
                                                    >
                                                        <SelectTrigger className="border border-gray-300 rounded-lg">
                                                            <SelectValue
                                                                value={type}
                                                                placeholder={
                                                                    language ===
                                                                    "en"
                                                                        ? "Select a Type"
                                                                        : language ===
                                                                          "ar"
                                                                        ? "اختر نوع"
                                                                        : "Sélectionner un Type"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="lab">
                                                                    Lab
                                                                </SelectItem>
                                                                <SelectItem value="research_unit">
                                                                    Research
                                                                    Unit
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            errors.lab_type
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-gray-600 text-sm mt-2">
                                                Note: Other lab details will be
                                                provided by the Director after
                                                registration.
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full  text-white rounded-lg py-2"
                                            disabled={processing}
                                        >
                                            {language === "en"
                                                ? processing
                                                    ? "Creating..."
                                                    : "Create Lab"
                                                : language === "ar"
                                                ? processing
                                                    ? "جاري التسجيل"
                                                    : "تسجيل"
                                                : processing
                                                ? "Inscription..."
                                                : "S'inscrire"}
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
        ? "All Lab Directors"
        : language === "ar"
        ? "جميع مديري المختبرات"
        : "Tous les directeurs de laboratoires"}
</CardTitle>
<CardDescription className="text-gray-600">
    {language === "en"
        ? "Recent Lab Directors"
        : language === "ar"
        ? "مديرو المختبرات الجدد"
        : "Directeurs de laboratoires récents"}
</CardDescription>

                            </div>
                            <div className="text-right">
                                {/* Filter and sort controls */}
                                <div className="flex items-center space-x-4 justify-end">
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
                                            <TableCell className="p-4 text-right flex justify-end space-x-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            className="bg-red-200 text-red-600"
                                                            variant="outline"
                                                        >
                                                            {language === "en"
                                                                ? "Delete"
                                                                : language ===
                                                                  "ar"
                                                                ? "حذف"
                                                                : "Supprimer"}
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
                                                                    ? "This action cannot be undone. This will permanently delete the lab director and remove the data from our servers."
                                                                    : language ===
                                                                      "ar"
                                                                    ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف مدير المختبر بشكل دائم وإزالة البيانات من خوادمنا."
                                                                    : "Cette action ne peut pas être annulée. Cela supprimera définitivement le directeur du laboratoire et supprimera les données de nos serveurs."}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user
                                                                    )
                                                                }
                                                            >
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <CustomPagination data={users} routeName={"dashboard.users"} />
        </AdminLayout>
    );
};

export default Users;
