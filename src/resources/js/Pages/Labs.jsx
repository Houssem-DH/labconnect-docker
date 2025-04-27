"use client";

import React, { useContext, useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";
import Layout from "@/Layouts/Layout";
import { FaInfoCircle } from "react-icons/fa";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { MdSearch } from "react-icons/md";
import { AiOutlineFilter } from "react-icons/ai";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Labs = ({
    auth,
    labs,
    services,
    materials,
    notifications,
    labMember,
    users,
    domains,
    labMembers,
}) => {
    const { language } = useContext(LanguageContext);

    const [search, setSearch] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [selectedResearcher, setSelectedResearcher] = useState("");
    const [isDomainPopoverOpen, setIsDomainPopoverOpen] = useState(false);
    const [isServicePopoverOpen, setIsServicePopoverOpen] = useState(false);
    const [isMaterialPopoverOpen, setIsMaterialPopoverOpen] = useState(false);
    const [isResearcherPopoverOpen, setIsResearcherPopoverOpen] =
        useState(false);

    // Extract unique service names
    const uniqueServices = [
        ...new Set(services.map((service) => service.title)),
    ];

    // Extract unique material names
    const uniqueMaterials = [
        ...new Set(materials.map((material) => material.name)),
    ];

    // Filtered labs based on search, selected domain, selected service, and selected material
    const filteredLabs = labs.filter((lab) => {
        const matchesSearch = lab.title
            ?.toLowerCase()
            .includes(search.toLowerCase());
        const matchesDomain = selectedDomain
            ? lab.domain.includes(selectedDomain)
            : true;
        const matchesService = selectedService
            ? services.some(
                  (service) =>
                      service.lab_id === lab.id &&
                      service.title.toLowerCase() ===
                          selectedService.toLowerCase()
              )
            : true;
        const matchesMaterial = selectedMaterial
            ? materials.some(
                  (material) =>
                      material.lab_id === lab.id &&
                      material.name.toLowerCase() ===
                          selectedMaterial.toLowerCase()
              )
            : true;

        const matchesResearcher = selectedResearcher
            ? labMembers.some(
                  (member) =>
                      member.lab_id === lab.id &&
                      `${member.user.first_name.toLowerCase()} ${member.user.last_name.toLowerCase()}` ===
                          selectedResearcher.toLowerCase()
              )
            : true;

        return (
            matchesSearch &&
            matchesDomain &&
            matchesService &&
            matchesMaterial &&
            matchesResearcher
        );
    });

    return (
        <Layout
            user={auth.user}
            notifications={notifications.list}
            notifications_count={notifications.count}
            labMember={labMember}
            users={users.users}
            chat_groups={users.chat_groups}
        >
            <Head title="Labs" />

            <div className="container mx-auto py-32 px-4">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    {language === "en"
                        ? "Explore Our Labs"
                        : language === "ar"
                        ? "استكشف مختبراتنا"
                        : "Découvrez nos laboratoires"}
                </h1>

                {/* Filter Navbar */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-gray-100 p-4 rounded-lg shadow-lg border-gray-50 animate__animated animate__fadeIn animate__delay-1s">
                    {/* Search Input with Icon */}
                    <div className="relative flex-grow max-w-xs">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={
                                language === "en"
                                    ? "Search By Name"
                                    : language === "ar"
                                    ? "البحث حسب الاسم"
                                    : "Rechercher par nom"
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-main transition-all duration-300 ease-in-out hover:ring-main"
                        />
                    </div>
                    {/* Researcher Dropdown using Combobox */}
                    <Popover
                        open={isResearcherPopoverOpen}
                        onOpenChange={setIsResearcherPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isResearcherPopoverOpen}
                                className="w-full md:w-1/4 justify-between"
                            >
                                {selectedResearcher
                                    ? labMembers.find(
                                          (member) =>
                                              `${member.user.first_name} ${member.user.last_name}` ===
                                              selectedResearcher
                                      )?.user.first_name
                                    : language === "en"
                                    ? "Select a Researcher"
                                    : language === "ar"
                                    ? "اختر باحثا"
                                    : "Sélectionnez un chercheur"}

                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 popover-content-width-full">
                            <Command>
                                <CommandInput
                                    placeholder={
                                        language === "en"
                                            ? "Search Researcher ..."
                                            : language === "ar"
                                            ? "بحث باحث..."
                                            : "Rechercher Chercheur ..."
                                    }
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        {language === "en"
                                            ? "No Researcher found."
                                            : language === "ar"
                                            ? "لم يتم العثور على أي باحث."
                                            : "Aucun chercheur trouvé."}
                                    </CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            key="all"
                                            onSelect={() => {
                                                setSelectedResearcher("");
                                                setIsResearcherPopoverOpen(
                                                    false
                                                );
                                            }}
                                        >
                                            {language === "en"
                                                ? "All Researchers"
                                                : language === "ar"
                                                ? "جميع الباحثين"
                                                : "Tous les chercheurs"}
                                        </CommandItem>
                                        {labMembers.map((member) =>
                                            member.user ? (
                                                <CommandItem
                                                    key={member.id}
                                                    onSelect={() => {
                                                        setSelectedResearcher(
                                                            `${member.user.first_name} ${member.user.last_name}`
                                                        );
                                                        setIsResearcherPopoverOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {`${member.user.first_name} ${member.user.last_name}`}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            selectedResearcher ===
                                                                `${member.user.first_name} ${member.user.last_name}`
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ) : null
                                        )}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {/* Domain Dropdown using Combobox */}
                    <Popover
                        open={isDomainPopoverOpen}
                        onOpenChange={setIsDomainPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isDomainPopoverOpen}
                                className="w-full md:w-1/4 justify-between"
                            >
                                {selectedDomain
                                    ? domains.find(
                                          (domain) =>
                                              domain.name === selectedDomain
                                      )?.name
                                    : language === "en"
                                    ? "Select a domain..."
                                    : language === "ar"
                                    ? "حدد المجال..."
                                    : "Sélectionnez un domaine..."}

                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 popover-content-width-full">
                            <Command>
                                <CommandInput placeholder="Search domain..." />
                                <CommandList>
                                    <CommandEmpty>
                                        {language === "en"
                                            ? "No domain found."
                                            : language === "ar"
                                            ? "لم يتم العثور على المجال."
                                            : "Aucun domaine trouvé."}
                                    </CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            key="all"
                                            onSelect={() => {
                                                setSelectedDomain("");
                                                setIsDomainPopoverOpen(false);
                                            }}
                                        >
                                            {language === "en"
                                                ? "All Domains"
                                                : language === "ar"
                                                ? "جميع المجالات"
                                                : "Tous les domaines"}
                                        </CommandItem>
                                        {domains.map((domain) => (
                                            <CommandItem
                                                key={domain.name}
                                                onSelect={() => {
                                                    setSelectedDomain(
                                                        domain.name
                                                    );
                                                    setIsDomainPopoverOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                {domain.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        selectedDomain ===
                                                            domain.name
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {/* Service Dropdown using Combobox */}
                    <Popover
                        open={isServicePopoverOpen}
                        onOpenChange={setIsServicePopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isServicePopoverOpen}
                                className="w-full md:w-1/4 justify-between"
                            >
                                {selectedService ||
                                    (language === "en"
                                        ? "Select a service..."
                                        : language === "ar"
                                        ? "اختر خدمة..."
                                        : "Sélectionnez un service...")}

                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 popover-content-width-full">
                            <Command>
                                <CommandInput placeholder="Search service..." />
                                <CommandList>
                                    <CommandEmpty>
                                        {language === "en"
                                            ? "No service found."
                                            : language === "ar"
                                            ? "لم يتم العثور على خدمة."
                                            : "Aucun service trouvé."}
                                    </CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            key="all"
                                            onSelect={() => {
                                                setSelectedService("");
                                                setIsServicePopoverOpen(false);
                                            }}
                                        >
                                            {language === "en"
                                                ? "All Services"
                                                : language === "ar"
                                                ? "جميع الخدمات"
                                                : "Tous les services"}
                                        </CommandItem>
                                        {uniqueServices.map((service) => (
                                            <CommandItem
                                                key={service}
                                                onSelect={() => {
                                                    setSelectedService(service);
                                                    setIsServicePopoverOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                {service}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        selectedService ===
                                                            service
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {/* Material Dropdown using Combobox */}
                    <Popover
                        open={isMaterialPopoverOpen}
                        onOpenChange={setIsMaterialPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isMaterialPopoverOpen}
                                className="w-full md:w-1/4 justify-between"
                            >
                                {selectedMaterial ||
                                    (language === "en"
                                        ? "Select a material..."
                                        : language === "ar"
                                        ? "اختر المادة..."
                                        : "Sélectionnez un matériau...")}

                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 popover-content-width-full">
                            <Command>
                                <CommandInput placeholder="Search material..." />
                                <CommandList>
                                    <CommandEmpty>
                                        {language === "en"
                                            ? "No material found."
                                            : language === "ar"
                                            ? "لم يتم العثور على أي مادة."
                                            : "Aucun matériel trouvé."}
                                    </CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            key="all"
                                            onSelect={() => {
                                                setSelectedMaterial("");
                                                setIsMaterialPopoverOpen(false);
                                            }}
                                        >
                                            {language === "en"
                                                ? "All Materials"
                                                : language === "ar"
                                                ? "جميع المواد"
                                                : "Tous les matériaux"}
                                        </CommandItem>
                                        {uniqueMaterials.map((material) => (
                                            <CommandItem
                                                key={material}
                                                onSelect={() => {
                                                    setSelectedMaterial(
                                                        material
                                                    );
                                                    setIsMaterialPopoverOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                {material}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        selectedMaterial ===
                                                            material
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Labs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {filteredLabs.map((lab, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50"
                        >
                            <div className="relative">
                                <img
                                    src={`storage/${lab.picture}`}
                                    alt={lab.title}
                                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                                />
                            </div>

                            <div className="p-6">
                                <h2
                                    className={`text-2xl font-bold text-main mb-3`}
                                >
                                    {lab.title}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {lab.presentation
                                        ? lab.presentation.slice(0, 100) + "..."
                                        : "No description available."}
                                </p>

                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/labs/${lab.id}`}
                                        className="text-white bg-main hover:bg-opacity-90 hover:shadow-lg py-2 px-6 rounded-full transition duration-300 transform hover:scale-105"
                                    >
                                        {language === "en"
                                            ? "View Details"
                                            : language === "ar"
                                            ? "عرض التفاصيل"
                                            : "Voir les détails"}
                                    </Link>
                                    <FaInfoCircle className="text-main w-7 h-7 transition-transform duration-300 hover:scale-125" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Labs;
