import React, { useState, useContext } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";

import { LanguageContext } from "@/lib/LanguageContext";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";

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
function EditEstDialog({ est, isOpen, onClose }) {
    const { language } = useContext(LanguageContext);

    const { data, setData, put, errors } = useForm({
        type: est.type,
        name: est.name,
        wilaya: est.wilaya,
    });

    const [wilaya, setWilaya] = useState(est.wilaya); // State for filtering role
    const [type, setType] = useState(est.type); // State for filtering role

    const submit = (e) => {
        e.preventDefault();

        put(route("dashboard.establishment.edit", { id: est.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {language === "en"
                            ? "Edit Establishment"
                            : language === "ar"
                            ? "تعديل المنشأة"
                            : "Modifier établissement"}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
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
                                                : language === "ar"
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
                                    setData("name", e.target.value)
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
                                                : language === "ar"
                                                ? "اختر ولاية"
                                                : "Sélectionner une wilaya"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {wilayaOptions.map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.value}
                                            >
                                                {option.id} {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <InputError message={errors.wilaya} />
                        </div>

                        <Button type="submit" className="w-full text-white">
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
    );
}

export default EditEstDialog;
