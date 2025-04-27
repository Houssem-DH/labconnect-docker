import AdminLayout from "@/Layouts/AdminLayout";
import { useEffect, useContext, useState } from "react";
import { Search } from "lucide-react";
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
import { Button } from "@/Components/ui/button";
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

import CustomPagination from "@/utils/Pagination"; // Import the custom pagination component

import { useForm, Head } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";

import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";

import EditEstDialog from "@/Components/Admin/Dialog/EditEstDialog";

const wilayaOptions = [
    { id: "1", value: "Adrar", label: "Adrar" },
    { id: "2", value: "Chlef", label: "Chlef" },
    { id: "3", value: "Laghouat", label: "Laghouat" },
    { id: "4", value: "Oum El Bouaghi", label: "Oum El Bouaghi" },
    { id: "5", value: "Batna", label: "Batna" },
    { id: "6", value: "Béjaïa", label: "Béjaïa" },
    { id: "7", value: "Biskra", label: "Biskra" },
    { id: "8", value: "Béchar", label: "Béchar" },
    { id: "9", value: "Blida", label: "Blida" },
    { id: "10", value: "Bouira", label: "Bouira" },
    { id: "11", value: "Tamanrasset", label: "Tamanrasset" },
    { id: "12", value: "Tébessa", label: "Tébessa" },
    { id: "13", value: "Tlemcen", label: "Tlemcen" },
    { id: "14", value: "Tiaret", label: "Tiaret" },
    { id: "15", value: "Tizi Ouzou", label: "Tizi Ouzou" },
    { id: "16", value: "Alger", label: "Alger" },
    { id: "17", value: "Djelfa", label: "Djelfa" },
    { id: "18", value: "Jijel", label: "Jijel" },
    { id: "19", value: "Sétif", label: "Sétif" },
    { id: "20", value: "Saïda", label: "Saïda" },
    { id: "21", value: "Skikda", label: "Skikda" },
    { id: "22", value: "Sidi Bel Abbès", label: "Sidi Bel Abbès" },
    { id: "23", value: "Annaba", label: "Annaba" },
    { id: "24", value: "Guelma", label: "Guelma" },
    { id: "25", value: "Constantine", label: "Constantine" },
    { id: "26", value: "Médéa", label: "Médéa" },
    { id: "27", value: "Mostaganem", label: "Mostaganem" },
    { id: "28", value: "M'Sila", label: "M'Sila" },
    { id: "29", value: "Mascara", label: "Mascara" },
    { id: "30", value: "Ouargla", label: "Ouargla" },
    { id: "31", value: "Oran", label: "Oran" },
    { id: "32", value: "El Bayadh", label: "El Bayadh" },
    { id: "33", value: "Illizi", label: "Illizi" },
    { id: "34", value: "Bordj Bou Arreridj", label: "Bordj Bou Arreridj" },
    { id: "35", value: "Boumerdès", label: "Boumerdès" },
    { id: "36", value: "El Tarf", label: "El Tarf" },
    { id: "37", value: "Tindouf", label: "Tindouf" },
    { id: "38", value: "Tissemsilt", label: "Tissemsilt" },
    { id: "39", value: "El Oued", label: "El Oued" },
    { id: "40", value: "Khenchela", label: "Khenchela" },
    { id: "41", value: "Souk Ahras", label: "Souk Ahras" },
    { id: "42", value: "Tipaza", label: "Tipaza" },
    { id: "43", value: "Mila", label: "Mila" },
    { id: "44", value: "Aïn Defla", label: "Aïn Defla" },
    { id: "45", value: "Naâma", label: "Naâma" },
    { id: "46", value: "Aïn Témouchent", label: "Aïn Témouchent" },
    { id: "47", value: "Ghardaïa", label: "Ghardaïa" },
    { id: "48", value: "Relizane", label: "Relizane" },
    { id: "49", value: "Timimoun", label: "Timimoun" },
    { id: "50", value: "Bordj Badji Mokhtar", label: "Bordj Badji Mokhtar" },
    { id: "51", value: "Ouled Djellal", label: "Ouled Djellal" },
    { id: "52", value: "Béni Abbès", label: "Béni Abbès" },
    { id: "53", value: "In Salah", label: "In Salah" },
    { id: "54", value: "In Guezzam", label: "In Guezzam" },
    { id: "55", value: "Touggourt", label: "Touggourt" },
    { id: "56", value: "Djanet", label: "Djanet" },
    { id: "57", value: "El M'Ghair", label: "El M'Ghair" },
    { id: "58", value: "El Menia", label: "El Menia" },
];

const Establishments = ({ establishments, auth }) => {
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false);

    const [wilaya, setWilaya] = useState(null); // State for filtering role
    const [type, setType] = useState(null); // State for filtering role

    const [searchTerm, setSearchTerm] = useState("");
    const [filterWilaya, setFilterWilaya] = useState("all"); // State for filtering by wilaya
    const [filterType, setFilterType] = useState("all"); // State for filtering by type

    const {
        data,
        setData,
        post,
        errors,
        delete: deleteRequest,
    } = useForm({
        type: "",
        name: "",
        wilaya: "",
    });

    const [selectedEst, setSelectedEst] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = (est) => {
        setSelectedEst(est);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedEst(null);
        setOpenDialog(false);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("dashboard.establishment.add"), {
            onSuccess: () => {
                setOpen(false);

                setData({
                    type: "",
                    name: "",
                    wilaya: "",
                });
            },
        });
    };

    // Function to handle delete action
    const handleDelete = (est) => {
        // Send delete request to the backend
        deleteRequest(`/dashboard/establishments/delete/${est.id}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleWilayaChange = (value) => {
        setFilterWilaya(value);
    };

    const handleTypeChange = (value) => {
        setFilterType(value);
    };

    const filteredEstablishments = establishments.data.filter((es) => {
        const fullName = es.name.toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesWilaya =
            filterWilaya === "all" || es.wilaya === filterWilaya;
        const matchesType = filterType === "all" || es.type === filterType;
        const matchesSearch = fullName.includes(search);

        return matchesWilaya && matchesType && matchesSearch;
    });

    return (
        <AdminLayout user={auth.user}>
            <Head
                title={
                    language === "en"
                        ? "Establishments"
                        : language === "ar"
                        ? "المؤسسات"
                        : "Établissements"
                }
            />
            <div className="flex justify-center mt-8">
                <div className="w-full max-w-6xl">
                    <div className="text-right my-6">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    {" "}
                                    {language === "en"
                                        ? "Add New Establishment"
                                        : language === "ar"
                                        ? "إضافة مؤسسة جديدة"
                                        : "Ajouter un nouvel établissement"}
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {language === "en"
                                            ? "Add New Establishment"
                                            : language === "ar"
                                            ? "إضافة منشأة جديدة"
                                            : "Ajouter un nouvel établissement"}
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className="text-gray-900">
                                    <form
                                        onSubmit={submit}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="grid gap-4">
                                            <Label htmlFor="type">
                                                {language === "en"
                                                    ? "Type"
                                                    : language === "ar"
                                                    ? "نوع"
                                                    : "Type"}
                                            </Label>

                                            <Select
                                                id="type"
                                                name="type"
                                                value={data.type}
                                                onValueChange={(value) => {
                                                    setData("type", value);
                                                    setType(value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full ">
                                                    <SelectValue
                                                        value={type}
                                                        placeholder={
                                                            language === "en"
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
                                                        <SelectItem value="University">
                                                            University
                                                        </SelectItem>
                                                        <SelectItem value="Private">
                                                            Private
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.type} />
                                        </div>
                                        <div className="grid gap-4">
                                            <Label htmlFor="name">
                                                {" "}
                                                {language === "en"
                                                    ? "Name"
                                                    : language === "ar"
                                                    ? "الاسم"
                                                    : "Nom"}
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                name="name"
                                                placeholder={
                                                    language === "en"
                                                        ? "Enter the name"
                                                        : language === "ar"
                                                        ? "أدخل الاسم"
                                                        : "Tapez le nom"
                                                }
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label htmlFor="wilaya">
                                                {language === "en"
                                                    ? "Province"
                                                    : language === "ar"
                                                    ? "الولاية"
                                                    : "Wilaya"}
                                            </Label>

                                            <Select
                                                id="wilaya"
                                                name="wilaya"
                                                value={data.wilaya}
                                                onValueChange={(value) => {
                                                    setData("wilaya", value);
                                                    setWilaya(value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        value={wilaya}
                                                        placeholder={
                                                            language === "en"
                                                                ? "Select a Wilaya"
                                                                : language ===
                                                                  "ar"
                                                                ? "اختر ولاية"
                                                                : "Sélectionner une wilaya"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {wilayaOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {option.id}{" "}
                                                                    {
                                                                        option.label
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <InputError
                                                message={errors.wilaya}
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
                        <CardHeader className="p-6 bg-gray-50 border-b border-gray-200 grid grid-cols-2 items-center">
                            <div>
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    {language === "en"
                                        ? "All Establishments"
                                        : language === "ar"
                                        ? "جميع المؤسسات"
                                        : "Tous les établissements"}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    {language === "en"
                                        ? "Establishments"
                                        : language === "ar"
                                        ? "المؤسسات"
                                        : "Établissements"}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="flex space-x-4 mb-4">
                                    <Select onValueChange={handleWilayaChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select wilaya" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Wilaya
                                                </SelectLabel>
                                                <SelectItem value="all">
                                                    All
                                                </SelectItem>
                                                {wilayaOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={handleTypeChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Type</SelectLabel>
                                                <SelectItem value="all">
                                                    All
                                                </SelectItem>
                                                <SelectItem value="University">
                                                    University
                                                </SelectItem>
                                                <SelectItem value="Private">
                                                    Private
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <div className="relative ml-auto flex-1 md:grow-0">
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
                                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            Type
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>wilaya</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEstablishments.map(
                                        (establishment) => (
                                            <TableRow
                                                key={establishment.id} // Ensure establishment.id is unique
                                                className="hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                {/* Table cells */}
                                                <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    {establishment.type}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    {establishment.name}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    <Badge className="text-xs text-white bg-gray-400">
                                                        {establishment.wilaya}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="p-4 text-right flex justify-end space-x-2">
                                                    <Button
                                                        className="bg-gray-200"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                establishment
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
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                className="bg-red-200 text-red-600"
                                                                variant="outline"
                                                            >
                                                                {language ===
                                                                "en"
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
                                                                        ? "This action cannot be undone. This will permanently delete the establishment and remove the data from our servers."
                                                                        : language ===
                                                                          "ar"
                                                                        ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنشأة بشكل دائم وإزالة البيانات من خوادمنا."
                                                                        : "Cette action ne peut pas être annulée. Cela supprimera définitivement l'établissement et supprimera les données de nos serveurs."}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            establishment
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
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {selectedEst && (
                    <EditEstDialog
                        est={selectedEst}
                        isOpen={openDialog}
                        onClose={handleCloseDialog}
                    />
                )}
            </div>

            {establishments ? (
                <CustomPagination
                    data={establishments}
                    routeName={"dashboard.establishments"}
                />
            ) : null}
        </AdminLayout>
    );
};

export default Establishments;
