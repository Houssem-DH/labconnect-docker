import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
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
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useForm } from "@inertiajs/react";

const AddScientificProductionModal = ({ isOpen, onClose, sc }) => {
    const { data, setData, put, errors, processing } = useForm({
        type: sc.type || "",
        title: sc.title || "",
        description: sc.description || "",
        url: sc.url || "",
        year_publication: sc.year_publication || "",
        file: sc.file,

        // Common fields for all types

        editors: sc.chapter?.[0]?.editors || sc.proceeding?.[0]?.editors || "",
        publishing_house:
            sc.proceeding?.[0]?.publishing_house ||
            sc.book?.[0]?.publishing_house ||
            "",
        pages: sc.conference?.[0]?.Pages || sc.proceeding?.[0]?.Pages || "",
        doi: sc.conference?.[0]?.doi || sc.proceeding?.[0]?.doi || "",
        volume: sc.proceeding?.[0]?.volume || sc.journal?.[0]?.volume || "",
        edition: sc.chapter?.[0]?.edition || sc.book?.[0]?.edition || "",
        country: sc.chapter?.[0]?.country || "",
        isbn: sc.book?.[0]?.isbn || sc.chapter?.[0]?.isbn || "",
        conference_location: sc.conference?.[0]?.conference_location || "",
        number: sc.journal?.[0]?.number || "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(
            route("director.space.scientific.productions.edit", {
                id: sc.id,
            }),
            {
                onSuccess: () => {
                    onClose();
                },
                data: data, // Send the form data
            }
        );
    };

    const [showAdditionalFields, setShowAdditionalFields] = useState(true);

    const handleChange = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Show additional fields if the type is selected
        if (name === "type") {
            setShowAdditionalFields(value !== "");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen p-6">
                <DialogHeader>
                    <DialogTitle>Edit Scientific Production</DialogTitle>
                    <DialogDescription>
                        {/* Add additional description if needed */}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <Label
                            htmlFor="title"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Title:
                        </Label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-2"
                            placeholder="Enter title"
                        />

                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="description"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Description:
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="mt-2"
                            placeholder="Enter description"
                        ></Textarea>
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Label
                            htmlFor="url"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            URL:
                        </Label>
                        <Input
                            type="text"
                            id="url"
                            name="url"
                            value={data.url}
                            onChange={(e) => setData("url", e.target.value)}
                            className="mt-2"
                            placeholder="Enter URL"
                        />
                        {errors.url && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.url}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="file">file:</Label>
                        <Input
                            type="file"
                            id="file"
                            name="file"
                            onChange={(e) => setData("file", e.target.files[0])}
                        />
                        {errors.file && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.file}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="type"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Type:
                        </Label>

                        <Select
                            id="member_type"
                            name="member_type"
                            value={data.type}
                            onValueChange={(value) => {
                                setData("type", value);
                                handleChange("type", value);
                            }}
                            disabled
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Enter Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Proceeding">
                                        Proceeding
                                    </SelectItem>
                                    <SelectItem value="Chapter">
                                        Chapter
                                    </SelectItem>
                                    <SelectItem value="Conference">
                                        Conference
                                    </SelectItem>
                                    <SelectItem value="Journal">
                                        Journal
                                    </SelectItem>
                                    <SelectItem value="Book">Book</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Label
                            htmlFor="year_publication"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Year of Publication:
                        </Label>
                        <Input
                            type="date"
                            id="year_publication"
                            name="year_publication"
                            value={data.year_publication}
                            onChange={(e) =>
                                setData("year_publication", e.target.value)
                            }
                            className="mt-2"
                            placeholder="Enter year of publication"
                        />
                        {errors.year_publication && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.year_publication}
                            </p>
                        )}
                    </div>
                    {showAdditionalFields && (
                        <>
                            {/* Additional fields for Type 1 */}
                            {data.type === "Proceeding" && (
                                <>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="volume"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Volume:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="volume"
                                            name="volume"
                                            value={data.volume}
                                            onChange={(e) =>
                                                setData(
                                                    "volume",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter volume"
                                        />
                                        {errors.volume && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.volume}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="editors"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Editors:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="editors"
                                            name="editors"
                                            value={data.editors}
                                            onChange={(e) =>
                                                setData(
                                                    "editors",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter editors"
                                        />
                                        {errors.editors && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.editors}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="publishing_house"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Publishing House:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="publishing_house"
                                            name="publishing_house"
                                            value={data.publishing_house}
                                            onChange={(e) =>
                                                setData(
                                                    "publishing_house",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter publishing house"
                                        />

                                        {errors.publishing_house && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.publishing_house}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="pages"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Pages:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="pages"
                                            name="pages"
                                            value={data.pages}
                                            onChange={(e) =>
                                                setData("pages", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter pages"
                                        />

                                        {errors.pages && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.pages}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="doi"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            DOI:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="doi"
                                            name="doi"
                                            value={data.doi}
                                            onChange={(e) =>
                                                setData("doi", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter DOI"
                                        />
                                    </div>
                                </>
                            )}
                            {/* Additional fields for Type 2 */}
                            {data.type === "Chapter" && (
                                <>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="editors"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Editors:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="editors"
                                            name="editors"
                                            value={data.editors}
                                            onChange={(e) =>
                                                setData(
                                                    "editors",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter editors"
                                        />

                                        {errors.editors && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.editors}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="edition"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Edition:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="edition"
                                            name="edition"
                                            value={data.edition}
                                            onChange={(e) =>
                                                setData(
                                                    "edition",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter edition"
                                        />
                                        {errors.edition && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.edition}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="publishing_house"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Publishing House:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="publishing_house"
                                            name="publishing_house"
                                            value={data.publishing_house}
                                            onChange={(e) =>
                                                setData(
                                                    "publishing_house",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter publishing house"
                                        />

                                        {errors.publishing_house && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.publishing_house}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="country"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Country:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={data.country}
                                            onChange={(e) =>
                                                setData(
                                                    "country",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter country"
                                        />
                                        {errors.country && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.country}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="Pages"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Pages:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="Pages"
                                            name="Pages"
                                            value={data.pages}
                                            onChange={(e) =>
                                                setData("pages", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter pages"
                                        />
                                        {errors.pages && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.pages}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="isbn"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            ISBN:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="isbn"
                                            name="isbn"
                                            value={data.isbn}
                                            onChange={(e) =>
                                                setData("isbn", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter ISBN"
                                        />
                                        {errors.isbn && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.isbn}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Additional fields for Type 2 */}
                            {data.type === "Conference" && (
                                <>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="conference_location"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Conference Location:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="conference_location"
                                            name="conference_location"
                                            value={data.conference_location}
                                            onChange={(e) =>
                                                setData(
                                                    "conference_location",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter conference location"
                                        />
                                        {errors.conference_location && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.conference_location}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="conference_pages"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Pages:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="conference_pages"
                                            name="Pages"
                                            value={data.pages}
                                            onChange={(e) =>
                                                setData("pages", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter conference pages"
                                        />
                                        {errors.pages && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.pages}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="conference_doi"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            DOI:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="conference_doi"
                                            name="doi"
                                            value={data.doi}
                                            onChange={(e) =>
                                                setData("doi", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter conference DOI"
                                        />
                                        {errors.doi && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.doi}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                            {/* Additional fields for Type 2 */}
                            {data.type === "Journal" && (
                                <>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="journal_volume"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Volume:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="journal_volume"
                                            name="volume"
                                            value={data.volume}
                                            onChange={(e) =>
                                                setData(
                                                    "volume",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter journal volume"
                                        />
                                        {errors.volume && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.volume}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="journal_number"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Number:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="journal_number"
                                            name="number"
                                            value={data.number}
                                            onChange={(e) =>
                                                setData(
                                                    "number",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter journal number"
                                        />
                                        {errors.number && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.number}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="journal_pages"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Pages:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="journal_pages"
                                            name="Pages"
                                            value={data.pages}
                                            onChange={(e) =>
                                                setData("pages", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter journal pages"
                                        />
                                        {errors.pages && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.pages}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="journal_doi"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            DOI:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="journal_doi"
                                            name="doi"
                                            value={data.doi}
                                            onChange={(e) =>
                                                setData("doi", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter journal DOI"
                                        />
                                        {errors.doi && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.doi}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {data.type === "Book" && (
                                <>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="edition"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Edition:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="edition"
                                            name="edition"
                                            value={data.edition}
                                            onChange={(e) =>
                                                setData(
                                                    "edition",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter edition"
                                        />
                                        {errors.edition && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.edition}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="publishing_house"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Publishing House:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="publishing_house"
                                            name="publishing_house"
                                            value={data.publishing_house}
                                            onChange={(e) =>
                                                setData(
                                                    "publishing_house",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Enter publishing house"
                                        />
                                        {errors.publishing_house && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.publishing_house}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label
                                            htmlFor="isbn"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            ISBN:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="isbn"
                                            name="isbn"
                                            value={data.isbn}
                                            onChange={(e) =>
                                                setData("isbn", e.target.value)
                                            }
                                            className="mt-2"
                                            placeholder="Enter ISBN"
                                        />
                                        {errors.isbn && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.isbn}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Add more conditions for other types */}
                        </>
                    )}

                    <div className="flex justify-between mt-4">
                        <Button type="submit" disabled={processing}>
                            Edit
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddScientificProductionModal;
