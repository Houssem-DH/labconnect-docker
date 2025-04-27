import AdminLayout from "@/Layouts/AdminLayout";
import { useContext, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHeader,
    TableHead,
} from "@/Components/ui/table";
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
    SelectGroup,
    SelectItem,
    SelectLabel,
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

import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

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

import EditFacultyDialog from "@/Components/Admin/Dialog/EditFacultyDialog";

const Faculties = ({ faculties, establishments, users, auth }) => {
    console.log(users);
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false); // Change to true to make the dialog initially open
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const {
        data,
        setData,
        post,
        errors,
        delete: deleteRequest,
    } = useForm({
        user_id: "",
        establishment_id: "",
        name: "",
    });
    console.log(selectedFaculty);

    const [openAdmin, setOpenAdmin] = useState(false); // Change to true to make the dialog initially open
    const [valueAdmin, setValueAdmin] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const [openEst, setOpenEst] = useState(false); // Change to true to make the dialog initially open
    const [valueEst, setValueEst] = useState("");
    const [selectedEst, setSelectedEst] = useState(null);

    const handleOpenDialog = (faculty) => {
        setSelectedFaculty(faculty);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedFaculty(null);
        setOpenDialog(false);
    };

    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const [searchTerm2, setSearchTerm2] = useState("");
    const handleSearchChange2 = (e) => {
        setSearchTerm2(e.target.value);
    };

    const [searchTerm3, setSearchTerm3] = useState("");
    const handleSearchChange3 = (e) => {
        setSearchTerm3(e.target.value);
    };

    const filteredFaculties = faculties.data.filter((faculty) => {
        const facultyName = faculty.name.toLowerCase();
        const search = searchTerm.toLowerCase();

        const establishmentName = faculty.establishment.name.toLowerCase();
        const search2 = searchTerm2.toLowerCase();

        const adminName = `${faculty.user.first_name.toLowerCase()} ${faculty.user.last_name.toLowerCase()}  `;
        const search3 = searchTerm3.toLowerCase();

        const matchesSearch = facultyName.includes(search);
        const matchesSearch2 = establishmentName.includes(search2);
        const matchesSearch3 = adminName.includes(search3);

        return matchesSearch && matchesSearch2 && matchesSearch3;
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("dashboard.faculty.add"), {
            onSuccess: () => {
                setOpen(false);
                setData({
                    user_id: "",
                    establishment_id: "",
                    name: "",
                });
                setOpenAdmin(false);
                setValueAdmin("");
                setSelectedUser(null);

                setOpenEst(false);
                setValueEst("");
                setSelectedEst(null);
            },
        });
    };

    // Function to handle delete action
    const handleDelete = (faculty) => {
        // Send delete request to the backend
        deleteRequest(`/dashboard/faculty/delete/${faculty.id}`);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head
                title={
                    language === "en"
                        ? "Faculties"
                        : language === "ar"
                        ? "المؤسسات"
                        : "Faculties"
                }
            />
            <div className="flex justify-center mt-8">
                <div className="w-full max-w-6xl">
                    <div className="text-right my-6">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    {language === "en"
                                        ? "Add New Faculty"
                                        : language === "ar"
                                        ? "إضافة مؤسسة جديدة"
                                        : "Ajouter un nouvel Faculty"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {language === "en"
                                            ? "Add New Faculty"
                                            : language === "ar"
                                            ? "إضافة منشأة جديدة"
                                            : "Ajouter un nouvel Faculty"}
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className="text-gray-900">
                                    <form
                                        onSubmit={submit}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="grid gap-4">
                                            <Label htmlFor="Admin">
                                                {" "}
                                                {language === "en"
                                                    ? "Enter the Admin"
                                                    : language === "ar"
                                                    ? "أدخل الاسم"
                                                    : "Entrez le Admin"}
                                            </Label>
                                            <Popover
                                                open={openAdmin}
                                                onOpenChange={setOpenAdmin}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={
                                                            openAdmin
                                                        }
                                                        className="w-full justify-between"
                                                    >
                                                        {selectedUser
                                                            ? selectedUser
                                                            : "Select user..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0  popover-content-width-full">
                                                    <Command>
                                                        <CommandInput placeholder="Search framework..." />
                                                        <CommandEmpty>
                                                            No admin found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {users.map(
                                                                (user) => (
                                                                    <CommandItem
                                                                        key={
                                                                            user.id
                                                                        }
                                                                        value={
                                                                            user.id
                                                                        }
                                                                        onSelect={() => {
                                                                            setValueAdmin(
                                                                                user.id
                                                                            ); // Set value directly as user id
                                                                            setSelectedUser(
                                                                                `${user.first_name} ${user.last_name}`
                                                                            ); // Set selectedUser with first name and last name
                                                                            setData(
                                                                                "user_id",
                                                                                user.id
                                                                            ); // Set form data

                                                                            setOpenAdmin(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                valueAdmin ===
                                                                                    user.id
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {
                                                                            user.first_name
                                                                        }{" "}
                                                                        {
                                                                            user.last_name
                                                                        }
                                                                        {/* Display first name and last name */}
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            <InputError
                                                message={errors.user_id}
                                            />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label htmlFor="name">
                                                {" "}
                                                {language === "en"
                                                    ? "Enter the name"
                                                    : language === "ar"
                                                    ? "أدخل الاسم"
                                                    : "Entrez le nom"}
                                            </Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={
                                                    language === "en"
                                                        ? "Name"
                                                        : language === "ar"
                                                        ? "اسم"
                                                        : "Nom"
                                                }
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label htmlFor="Establishment">
                                                {" "}
                                                {language === "en"
                                                    ? "Enter the Establishment"
                                                    : language === "ar"
                                                    ? "أدخل الاسم"
                                                    : "Entrez le Establishment"}
                                            </Label>
                                            <Popover
                                                open={openEst}
                                                onOpenChange={setOpenEst}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openEst}
                                                        className="w-full justify-between"
                                                    >
                                                        {selectedEst
                                                            ? selectedEst
                                                            : "Select establishment..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0  popover-content-width-full">
                                                    <Command>
                                                        <CommandInput placeholder="Search framework..." />
                                                        <CommandEmpty>
                                                            No establishment
                                                            found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {establishments.map(
                                                                (est) => (
                                                                    <CommandItem
                                                                        key={
                                                                            est.id
                                                                        }
                                                                        value={
                                                                            est.id
                                                                        }
                                                                        onSelect={() => {
                                                                            setValueEst(
                                                                                est.id
                                                                            ); // Set value directly as est id
                                                                            setSelectedEst(
                                                                                est.name
                                                                            ); // Set seleted Est with first name and last name
                                                                            setData(
                                                                                "establishment_id",
                                                                                est.id
                                                                            ); // Set form data

                                                                            setOpenEst(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                valueEst ===
                                                                                    est.id
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {
                                                                            est.name
                                                                        }
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={
                                                    errors.establishment_id
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full text-white"
                                        >
                                            {language === "en"
                                                ? "Submit"
                                                : language === "ar"
                                                ? "تفدم"
                                                : "Soumettre"}
                                        </Button>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <CardHeader className="p-6 bg-gray-50 border-b border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                            <div>
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    {language === "en"
                                        ? "All Faculties"
                                        : language === "ar"
                                        ? "جميع المؤسسات"
                                        : "Tous les faculties"}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    {language === "en"
                                        ? "Faculties"
                                        : language === "ar"
                                        ? "المؤسسات"
                                        : "Faculties"}
                                </CardDescription>
                            </div>

                            <div className="flex flex-wrap lg:flex-nowrap space-x-0 lg:space-x-4 space-y-4 lg:space-y-0 w-full lg:w-auto">
                                <div className="relative flex-1 min-w-[150px] lg:min-w-[200px] xl:min-w-[240px]">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={
                                            language === "en"
                                                ? "Search by name..."
                                                : language === "ar"
                                                ? "البحث عن طريق الاسم..."
                                                : "Rechercher par nom..."
                                        }
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full rounded-lg bg-background pl-8"
                                    />
                                </div>
                                <div className="relative flex-1 min-w-[150px] lg:min-w-[200px] xl:min-w-[240px]">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={
                                            language === "en"
                                                ? "Search by Establishment..."
                                                : language === "ar"
                                                ? "البحث عن طريق المؤسسة..."
                                                : "Rechercher par établissement..."
                                        }
                                        value={searchTerm2}
                                        onChange={handleSearchChange2}
                                        className="w-full rounded-lg bg-background pl-8"
                                    />
                                </div>
                                <div className="relative flex-1 min-w-[150px] lg:min-w-[200px] xl:min-w-[240px]">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={
                                            language === "en"
                                                ? "Search by Admin..."
                                                : language === "ar"
                                                ? "البحث عن طريق المدير..."
                                                : "Rechercher par admin..."
                                        }
                                        value={searchTerm3}
                                        onChange={handleSearchChange3}
                                        className="w-full rounded-lg bg-background pl-8"
                                    />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            Name
                                        </TableHead>
                                        <TableHead>Establishment</TableHead>
                                        <TableHead>Admin</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredFaculties.map((faculty) => (
                                        <TableRow
                                            key={faculty.id} // Ensure establishment.id is unique
                                            className="hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            {/* Table cells */}
                                            <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                                                {faculty.name}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                                                {faculty.establishment.name}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                                                <Badge className="text-xs text-white bg-main">
                                                    {faculty.user.first_name}{" "}
                                                    {faculty.user.last_name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-4 text-right flex justify-end space-x-2">
                                                <Button
                                                    className="bg-gray-200"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleOpenDialog(
                                                            faculty
                                                        )
                                                    }
                                                >
                                                    {language === "en"
                                                        ? "Manage"
                                                        : language === "ar"
                                                        ? "إدارة"
                                                        : "Gérer"}
                                                </Button>

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
                                                                    ? "This action cannot be undone. This will permanently delete the faculty and remove the data from our servers."
                                                                    : language ===
                                                                      "ar"
                                                                    ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الكلية بشكل دائم وإزالة البيانات من خوادمنا."
                                                                    : "Cette action ne peut pas être annulée. Cela supprimera définitivement la faculté et supprimera les données de nos serveurs."}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        faculty
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

                {selectedFaculty && (
                    <EditFacultyDialog
                        establishments={establishments}
                        users={users}
                        faculty={selectedFaculty}
                        isOpen={openDialog}
                        onClose={handleCloseDialog}
                    />
                )}
            </div>

            {faculties ? (
                <CustomPagination
                    data={faculties}
                    routeName={"dashboard.faculty"}
                />
            ) : null}
        </AdminLayout>
    );
};

export default Faculties;
