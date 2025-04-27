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

import EditDomainDialog from "@/Components/Admin/Dialog/EditDomainDialog";

const Domains = ({ domains, auth }) => {
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false); // Change to true to make the dialog initially open
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const {
        data,
        setData,
        post,
        errors,
        delete: deleteRequest,
    } = useForm({
        name: "",
    });


    const handleOpenDialog = (domain) => {
        setSelectedDomain(domain);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedDomain(null);
        setOpenDialog(false);
    };

    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const filteredDomains = domains.data.filter((domain) => {
        const domainName = domain.name.toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = domainName.includes(search);

        return matchesSearch;
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("dashboard.domain.add"), {
            onSuccess: () => {
                setOpen(false);
                setData({
                    name: "",
                });
            },
        });
    };

    // Function to handle delete action
    const handleDelete = (domain) => {
        // Send delete request to the backend
        deleteRequest(`/dashboard/domain/delete/${domain.id}`);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head
                title={
                    language === "en"
                        ? "Domains"
                        : language === "ar"
                        ? "المؤسسات"
                        : "Domains"
                }
            />
            <div className="flex justify-center mt-8">
                <div className="w-full max-w-6xl">
                    <div className="text-right my-6">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    {language === "en"
                                        ? "Add New Domain"
                                        : language === "ar"
                                        ? "إضافة مؤسسة جديدة"
                                        : "Ajouter un nouvel Domain"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {language === "en"
                                            ? "Add New Domain"
                                            : language === "ar"
                                            ? "إضافة منشأة جديدة"
                                            : "Ajouter un nouvel Domain"}
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className="text-gray-900">
                                    <form
                                        onSubmit={submit}
                                        className="mt-8 space-y-6"
                                    >
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
                                        ? "All Domains"
                                        : language === "ar"
                                        ? "جميع المؤسسات"
                                        : "Tous les Domains"}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    {language === "en"
                                        ? "Domains"
                                        : language === "ar"
                                        ? "المؤسسات"
                                        : "Domains"}
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
                                
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            Name
                                        </TableHead>
                                        
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDomains.map((domain) => (
                                        <TableRow
                                            key={domain.id} // Ensure establishment.id is unique
                                            className="hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            {/* Table cells */}
                                            <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                                                {domain.name}
                                            </TableCell>
                                           
                                            <TableCell className="p-4 text-right flex justify-end space-x-2">
                                                <Button
                                                    className="bg-gray-200"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleOpenDialog(
                                                            domain
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
                                                                        domain
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

                {selectedDomain && (
                    <EditDomainDialog
                        domain={selectedDomain}
                        isOpen={openDialog}
                        onClose={handleCloseDialog}
                    />
                )}
            </div>

            {domains ? (
                <CustomPagination
                    data={domains}
                    routeName={"dashboard.domains"}
                />
            ) : null}
        </AdminLayout>
    );
};

export default Domains;
