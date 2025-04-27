import React, { useState, useContext, useEffect } from "react";

import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import InputMask from "react-input-mask";
import { v4 as uuidv4 } from "uuid";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";

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

import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react";

const AddLabMemberModal = ({
    isOpen,
    onClose,
    lab,
    domains,
    specialities,
    faculty,
    onLocationSelect = () => {},
}) => {
    const { language } = useContext(LanguageContext);

    const initialDomains = JSON.parse(lab.domain || "[]");
    const initialSpecialities = JSON.parse(lab.speciality || "[]");

    const [inputs, setInputs] = useState(() => {
        // Create domain-speciality map from initial lab data
        const domainSpecialityMap = [];

        initialDomains.forEach((domainName) => {
            const domain = domains.find((d) => d.name === domainName);
            if (domain) {
                const relatedSpecialities = initialSpecialities.filter(
                    (specialityName) => {
                        return specialities.some(
                            (s) =>
                                s.name === specialityName &&
                                s.domain_id === domain.id
                        );
                    }
                );

                relatedSpecialities.forEach((specialityName) => {
                    const speciality = specialities.find(
                        (s) =>
                            s.name === specialityName &&
                            s.domain_id === domain.id
                    );
                    if (speciality) {
                        domainSpecialityMap.push({
                            domain,
                            speciality,
                            id: uuidv4(),
                        });
                    }
                });
            }
        });

        return domainSpecialityMap;
    });

    const {
        data,

        setData,
        put,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        type: lab.type,
        domain_id: inputs.map((input) =>
            input.domain ? input.domain.id : null
        ),
        speciality_id: inputs.map((input) =>
            input.speciality ? input.speciality.id : null
        ),
        title: lab.title,
        acronym_lab_name: lab.acronym_lab_name,
        creation_date: lab.creation_date,
        date_appointment: lab.date_appointment,
        previous_director: lab.previous_director,
        e_adresse: lab.e_adresse,
        tlp: lab.tlp,
        presentation: lab.presentation,
        research_objectives: lab.research_objectives,
        Keywords: lab.Keywords,
        maps: JSON.parse(lab.maps),
    });

    useEffect(() => {
        // Extract domain and speciality IDs from inputs
        const domainIds = inputs.map((input) =>
            input.domain ? input.domain.id : null
        );
        const specialityIds = inputs.map((input) =>
            input.speciality ? input.speciality.id : null
        );

        // Update form data
        setData((prevData) => ({
            ...prevData,
            domain_id: domainIds,
            speciality_id: specialityIds,
        }));
    }, [inputs]);

    const addInput = () => {
        setInputs((prev) => [
            ...prev,
            { domain: null, speciality: null, id: uuidv4() },
        ]);
    };

    const removeInput = (id) => {
        setInputs((prev) => prev.filter((input) => input.id !== id));
    };

    const handleDomainSelect = (index, domain) => {
        const updatedInputs = [...inputs];
        updatedInputs[index].domain = domain || {};
        updatedInputs[index].speciality = null; // Clear speciality when domain changes
        setInputs(updatedInputs);
    };

    const handleSpecialitySelect = (index, speciality) => {
        const updatedInputs = [...inputs];
        updatedInputs[index].speciality = speciality || {};
        setInputs(updatedInputs);
    };

    const [position, setPosition] = useState(
        JSON.parse(lab.maps) || [36.19722216267137, 5.364332199096681]
    );

    

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]); // Update the marker position
                onLocationSelect({ lat, lng }); // Notify parent component of location change

                // Update form data directly with the new position
                setData((prevData) => ({
                    ...prevData,
                    maps: [lat, lng], // Use lat and lng directly
                }));
            },
        });
        return null;
    };

    

    const submit = (e) => {
        e.preventDefault();

        put(route("manage-lab", lab.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className=" max-w-3xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>Manage Lab</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            <Label htmlFor="establishment">
                                {" "}
                                {language === "en"
                                    ? "Establishment *"
                                    : language === "ar"
                                    ? "اللقب"
                                    : "Establishment *"}
                            </Label>
                            <Input
                                type="text"
                                id="establishment"
                                name="establishment"
                                value={faculty.establishment.name}
                                autoComplete="establishment"
                                placeholder={
                                    language === "en"
                                        ? "Establishment"
                                        : language === "ar"
                                        ? "اللقب"
                                        : "Establishment"
                                }
                                readonly
                                required
                            />
                            <InputError message={errors.establishment} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="faculty_institute">
                                {language === "en"
                                    ? "Faculty or Institute *"
                                    : language === "ar"
                                    ? "الاسم"
                                    : "Faculty or Institute *"}
                            </Label>
                            <Input
                                type="text"
                                id="faculty_institute"
                                name="faculty_institute"
                                value={faculty.name}
                                placeholder={
                                    language === "en"
                                        ? "Faculty or Institute"
                                        : language === "ar"
                                        ? "الاسم"
                                        : "Faculty or Institute"
                                }
                                autoComplete="faculty_institute"
                                readonly
                            />
                            <InputError message={errors.faculty_institute} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="type">
                                {language === "en"
                                    ? "Type"
                                    : language === "ar"
                                    ? "الولاية"
                                    : "Type"}
                            </Label>

                            <Select
                                id="type"
                                name="type"
                                value={data.type}
                                onValueChange={(value) => {
                                    setData("type", value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            language === "en"
                                                ? "Select Lab Type"
                                                : language === "ar"
                                                ? "اختر ولاية"
                                                : "Sélectionner le type"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="research_unit">
                                            Research Unit
                                        </SelectItem>
                                        <SelectItem value="lab">Lab</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <InputError message={errors.wilaya} />
                        </div>

                        <div className="grid gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addInput}
                                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 flex items-center justify-center"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Add Domain and Speciality
                            </Button>

                            {inputs.map((input, index) => (
                                <div
                                    key={input.id}
                                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                                >
                                    <div className="w-full">
                                        <Label className="text-sm font-medium">
                                            {language === "en"
                                                ? "Domain"
                                                : language === "ar"
                                                ? "أدخل الاسم"
                                                : "Entrez le Domain"}

                                            <InputError
                                                message={errors.domain_id}
                                            />
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full mt-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 flex justify-between items-center"
                                                >
                                                    {input.domain
                                                        ? input.domain.name
                                                        : "Select Domain..."}
                                                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-full mt-2 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg">
                                                <Command>
                                                    <CommandInput placeholder="Search Domain..." />
                                                    <CommandEmpty>
                                                        No Domain found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {domains.map(
                                                            (domain) => (
                                                                <CommandItem
                                                                    key={
                                                                        domain.id
                                                                    }
                                                                    value={
                                                                        domain.id
                                                                    }
                                                                    onSelect={() =>
                                                                        handleDomainSelect(
                                                                            index,
                                                                            domain
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                >
                                                                    <Check
                                                                        className={
                                                                            input.domain &&
                                                                            input
                                                                                .domain
                                                                                .id ===
                                                                                domain.id
                                                                                ? "mr-2 h-5 w-5 opacity-100 text-green-500"
                                                                                : "mr-2 h-5 w-5 opacity-0"
                                                                        }
                                                                    />
                                                                    {
                                                                        domain.name
                                                                    }
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="w-full">
                                        <Label className="text-sm font-medium">
                                            {language === "en"
                                                ? "Speciality"
                                                : language === "ar"
                                                ? "البلدية"
                                                : "Spécialité"}
                                            <InputError
                                                message={errors.speciality_id}
                                            />
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full mt-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 flex justify-between items-center"
                                                >
                                                    {input.speciality
                                                        ? input.speciality.name
                                                        : "Select Speciality..."}
                                                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-full mt-2 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg">
                                                <Command>
                                                    <CommandInput placeholder="Search Speciality..." />
                                                    <CommandEmpty>
                                                        No Speciality found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {specialities
                                                            .filter(
                                                                (speciality) =>
                                                                    speciality.domain_id ===
                                                                    (input.domain
                                                                        ? input
                                                                              .domain
                                                                              .id
                                                                        : null)
                                                            )
                                                            .map(
                                                                (
                                                                    speciality
                                                                ) => (
                                                                    <CommandItem
                                                                        key={
                                                                            speciality.id
                                                                        }
                                                                        value={
                                                                            speciality.id
                                                                        }
                                                                        onSelect={() =>
                                                                            handleSpecialitySelect(
                                                                                index,
                                                                                speciality
                                                                            )
                                                                        }
                                                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    >
                                                                        <Check
                                                                            className={
                                                                                input.speciality &&
                                                                                input
                                                                                    .speciality
                                                                                    .id ===
                                                                                    speciality.id
                                                                                    ? "mr-2 h-5 w-5 opacity-100 text-green-500"
                                                                                    : "mr-2 h-5 w-5 opacity-0"
                                                                            }
                                                                        />
                                                                        {
                                                                            speciality.name
                                                                        }
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => removeInput(input.id)}
                                        className="mt-7 bg-red-500 text-white hover:bg-red-600 rounded-lg py-2 px-4"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="title">
                                {" "}
                                {language === "en"
                                    ? "Title *"
                                    : language === "ar"
                                    ? "اللقب"
                                    : "Title *"}
                            </Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={data.title}
                                autoComplete="title"
                                placeholder={
                                    language === "en"
                                        ? "Title"
                                        : language === "ar"
                                        ? "اللقب"
                                        : "Title"
                                }
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="acronym_lab_name">
                                {language === "en"
                                    ? "Acronym Lab Name *"
                                    : language === "ar"
                                    ? "الاسم المختصر للمختبر *"
                                    : "Nom Acronyme du Laboratoire *"}
                            </Label>
                            <Input
                                type="text"
                                id="acronym_lab_name"
                                name="acronym_lab_name"
                                value={data.acronym_lab_name}
                                autoComplete="acronym_lab_name"
                                placeholder={
                                    language === "en"
                                        ? "Acronym Lab Name"
                                        : language === "ar"
                                        ? "الاسم المختصر للمختبر"
                                        : "Nom Acronyme du Laboratoire"
                                }
                                onChange={(e) =>
                                    setData("acronym_lab_name", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.acronym_lab_name} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="creation_date">
                                {language === "en"
                                    ? "Creation Date *"
                                    : language === "ar"
                                    ? "تاريخ الإنشاء *"
                                    : "Date de Création *"}
                            </Label>
                            <Input
                                type="date"
                                id="creation_date"
                                name="creation_date"
                                value={data.creation_date}
                                autoComplete="creation_date"
                                onChange={(e) =>
                                    setData("creation_date", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.creation_date} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="date_appointment">
                                {language === "en"
                                    ? "Date of Appointment *"
                                    : language === "ar"
                                    ? "تاريخ التعيين *"
                                    : "Date de Nomination *"}
                            </Label>
                            <Input
                                type="date"
                                id="date_appointment"
                                name="date_appointment"
                                value={data.date_appointment}
                                autoComplete="date_appointment"
                                onChange={(e) =>
                                    setData("date_appointment", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.date_appointment} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="previous_director">
                                {language === "en"
                                    ? "Previous Director *"
                                    : language === "ar"
                                    ? "المدير السابق *"
                                    : "Directeur Précédent *"}
                            </Label>
                            <Input
                                type="text"
                                id="previous_director"
                                name="previous_director"
                                value={data.previous_director}
                                autoComplete="previous_director"
                                placeholder={
                                    language === "en"
                                        ? "Previous Director"
                                        : language === "ar"
                                        ? "المدير السابق"
                                        : "Directeur Précédent"
                                }
                                onChange={(e) =>
                                    setData("previous_director", e.target.value)
                                }
                                maxLength="255"
                                required
                            />
                            <InputError message={errors.previous_director} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="e_adresse">
                                {language === "en"
                                    ? "Email Address *"
                                    : language === "ar"
                                    ? "عنوان البريد الإلكتروني *"
                                    : "Adresse Email *"}
                            </Label>
                            <Input
                                type="email"
                                id="e_adresse"
                                name="e_adresse"
                                value={data.e_adresse}
                                autoComplete="e_adresse"
                                placeholder={
                                    language === "en"
                                        ? "Email Address"
                                        : language === "ar"
                                        ? "عنوان البريد الإلكتروني"
                                        : "Adresse Email"
                                }
                                onChange={(e) =>
                                    setData("e_adresse", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.e_adresse} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="tlp">
                                {language === "en"
                                    ? "Phone *"
                                    : language === "ar"
                                    ? "الهاتف *"
                                    : "Téléphone *"}
                            </Label>
                            <Input
                                value={data.tlp}
                                onChange={(e) => setData("tlp", e.target.value)}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={
                                    language === "en"
                                        ? "Phone"
                                        : language === "ar"
                                        ? "الهاتف"
                                        : "Téléphone"
                                }
                            ></Input>
                            <InputError message={errors.tlp} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="presentation">
                                {language === "en"
                                    ? "Presentation *"
                                    : language === "ar"
                                    ? "العرض *"
                                    : "Présentation *"}
                            </Label>
                            <Textarea
                                id="presentation"
                                name="presentation"
                                value={data.presentation}
                                autoComplete="presentation"
                                placeholder={
                                    language === "en"
                                        ? "Presentation"
                                        : language === "ar"
                                        ? "العرض"
                                        : "Présentation"
                                }
                                onChange={(e) =>
                                    setData("presentation", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.presentation} />
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="research_objectives">
                                {language === "en"
                                    ? "Research Objectives *"
                                    : language === "ar"
                                    ? "أهداف البحث *"
                                    : "Objectifs de Recherche *"}
                            </Label>
                            <Textarea
                                id="research_objectives"
                                name="research_objectives"
                                value={data.research_objectives}
                                autoComplete="research_objectives"
                                placeholder={
                                    language === "en"
                                        ? "Research Objectives"
                                        : language === "ar"
                                        ? "أهداف البحث"
                                        : "Objectifs de Recherche"
                                }
                                onChange={(e) =>
                                    setData(
                                        "research_objectives",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <InputError message={errors.research_objectives} />
                        </div>
                        <div className="grid gap-4">
                            <Label htmlFor="Location">
                                {language === "en"
                                    ? "Location "
                                    : language === "ar"
                                    ? "الكلمات الرئيسية (اختياري)"
                                    : "Mots-Clés (Optionnel)"}
                            </Label>
                            <InputError message={errors.maps} />
                            <MapContainer
                                center={position}
                                zoom={10}
                                style={{ height: "400px", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    
                                />
                                <Marker position={position} />
                                <MapClickHandler />
                            </MapContainer>
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="Keywords">
                                {language === "en"
                                    ? "Keywords (Optional)"
                                    : language === "ar"
                                    ? "الكلمات الرئيسية (اختياري)"
                                    : "Mots-Clés (Optionnel)"}
                            </Label>
                            <Textarea
                                id="Keywords"
                                name="Keywords"
                                value={data.Keywords}
                                autoComplete="Keywords"
                                placeholder={
                                    language === "en"
                                        ? "Keywords"
                                        : language === "ar"
                                        ? "الكلمات الرئيسية"
                                        : "Mots-Clés"
                                }
                                onChange={(e) =>
                                    setData("Keywords", e.target.value)
                                }
                            />
                            <InputError message={errors.Keywords} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full  text-white "
                            disabled={processing}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddLabMemberModal;
