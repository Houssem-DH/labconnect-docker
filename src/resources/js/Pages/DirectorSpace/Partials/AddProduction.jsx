import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { FiTrash2, FiPlus, FiChevronRight } from "react-icons/fi";
import { Link,Head } from "@inertiajs/react";

const AddProject = ({
    auth,
    userRole,
    lab,
    lab_members,
    labs,
    lab_members_all,
    teamy,
}) => {
    const { data, setData, post, errors } = useForm({
        type: "",
        title: "",
        description: "",
        url: "",
        picture: null,
        file: null,
        material: "",
        year_publication: "",
        journal_title: "",
        volume: "",
        number: "",
        Pages: "",
        doi: "",
        proceeding_title: "",
        editors: "",
        publishing_house: "",
        conference_title: "",
        conference_location: "",
        book_title: "",
        edition: "",
        country: "",
        isbn: "",
        in_lab_user_ids: [], // Array of selected lab user IDs
        out_lab_user_ids: [], // Array of selected outside user IDs
        f_names: [],
        l_names: [],
        emails: [],
    });

    const [selectedLabs, setSelectedLabs] = useState([]);
    const [establishments, setEstablishments] = useState([]);

    const handleEstablishmentChange = (e, index) => {
        const newEstablishments = [...establishments];
        newEstablishments[index] = e.target.value;
        setEstablishments(newEstablishments);
        setSelectedLabs((prevSelectedLabs) => {
            const newSelectedLabs = [...prevSelectedLabs];
            newSelectedLabs[index] = ""; // Reset selected lab when changing establishment
            return newSelectedLabs;
        });
    };

    const handleLabChange = (e, index) => {
        const newSelectedLabs = [...selectedLabs];
        newSelectedLabs[index] = e.target.value;
        setSelectedLabs(newSelectedLabs);
        setData("user_id", ""); // Reset selected user_id when changing lab
    };

    const [inLabUsers, setInLabUsers] = useState([]);

    const [outLabUsers, setOutLabUsers] = useState([]);

    const handleOutAddUser = () => {
        setOutLabUsers([...outLabUsers, ""]);
    };

    const handleRemoveOutUser = (index) => {
        const updatedUsers = [...outLabUsers];
        updatedUsers.splice(index, 1);
        setOutLabUsers(updatedUsers);

        // Remove the corresponding lab user ID from data.in_lab_user_ids array
        const updatedLabUserIds = [...data.in_lab_user_ids];
        updatedLabUserIds.splice(index, 1);
        setData("in_lab_user_ids", updatedLabUserIds);
    };

    const handleLabUserNameOutChange = (e, index) => {
        const updatedLabUsers = [...outLabUsers];
        updatedLabUsers[index] = e.target.value;
        setOutLabUsers(updatedLabUsers);
    };

    const handleAddUser = () => {
        setInLabUsers([...inLabUsers, ""]);
    };

    const handleRemoveUser = (index) => {
        const updatedUsers = [...inLabUsers];
        updatedUsers.splice(index, 1);
        setInLabUsers(updatedUsers);

        // Remove the corresponding lab user ID from data.in_lab_user_ids array
        const updatedLabUserIds = [...data.in_lab_user_ids];
        updatedLabUserIds.splice(index, 1);
        setData("in_lab_user_ids", updatedLabUserIds);
    };
    const handleLabUserNameChange = (e, index) => {
        const updatedUsers = [...inLabUsers];
        updatedUsers[index] = e.target.value;
        setInLabUsers(updatedUsers);

        // Update the corresponding lab user ID in data.in_lab_user_ids array
        const updatedLabUserIds = [...data.in_lab_user_ids];
        updatedLabUserIds[index] = e.target.value;
        setData("in_lab_user_ids", updatedLabUserIds);
    };

    const handleTypeChange = (e) => {
        setData("type", e.target.value);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setData(name, type === "file" ? files[0] : value);
    };


    const [users, setUsers] = useState([{ f_name: "", l_name: "", email: "" }]);

    const handleAddExternalUser = () => {
        setUsers([...users, { f_name: "", l_name: "", email: "" }]);
    };

    const handleRemoveExternalUser = (index) => {
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        setUsers(updatedUsers);
    };

    const handleExternalUserChange = (index, key, value) => {
        const updatedUsers = [...users];
        updatedUsers[index][key] = value;
        setUsers(updatedUsers);
        // Update the form data for f_names, l_names, and emails
        const updatedFNames = [...data.f_names];
        const updatedLNames = [...data.l_names];
        const updatedEmails = [...data.emails];
        if (key === "f_name") {
            updatedFNames[index] = value;
        } else if (key === "l_name") {
            updatedLNames[index] = value;
        } else if (key === "email") {
            updatedEmails[index] = value;
        }
  
        setData({ ...data, f_names: updatedFNames, l_names: updatedLNames, emails: updatedEmails });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("lab.team.scientific.production.insert", { id: teamy.id }), {
            onSuccess: () => {
                // Redirect to the appropriate page upon successful form submission
                // For example:
                // window.location.href = route('lab.team.manage', { id: team.id });
            },
        });
    };

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Add Production" />
            <SpaceLayout>
                <div className="flex justify-center items-center text-gray-600 max-w-5xl w-full overflow-hidden">
                    <FiChevronRight className="w-5 h-5" />
                    <Link
                        href="/director-space/teams"
                        className="ml-2 font-semibold hover:text-gray-900"
                    >
                        Teams
                    </Link>
                    <FiChevronRight className="mx-2 w-5 h-5" />
                    <Link
                        href={`/director-space/manage-lab/manage-team/${teamy.id}`}
                        className="ml-2 font-semibold hover:text-gray-900"
                    >
                        Manage Team
                    </Link>
                    <FiChevronRight className="mx-2 w-5 h-5" />
                    <span className="font-semibold cursor-default">
                        Add Scientific Production
                    </span>
                </div>

                <div className="flex justify-center items-center pb-24 pt-12 ">
                    <div className="max-w-5xl w-full">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <h2 className="text-2xl font-bold p-6 bg-gray-800 text-white-500">
                                Add Scientific Production
                            </h2>
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="mb-8">
                                    <label
                                        htmlFor="type"
                                        className="block font-medium text-gray-700"
                                    >
                                        Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={data.type}
                                        onChange={handleTypeChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    >
                                        <option value="">Select type</option>
                                        <option value="Journal">Journal</option>
                                        <option value="Proceeding">
                                            Proceeding
                                        </option>
                                        <option value="Conference">
                                            Conference
                                        </option>
                                        <option value="Chapter">Chapter</option>
                                        <option value="Book">Book</option>
                                        {/* Add more options based on your controller */}
                                    </select>
                                    <p className="text-red-500 text-sm">
                                        {errors.type}
                                    </p>
                                </div>

                                {/* Add more input fields based on the type */}
                                {data.type === "Journal" && (
                                    <>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="doi"
                                                className="block font-medium text-gray-700"
                                            >
                                                DOI
                                            </label>
                                            <input
                                                type="text"
                                                id="doi"
                                                name="doi"
                                                value={data.doi}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.doi}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="journal_title"
                                                className="block font-medium text-gray-700"
                                            >
                                                Journal Title
                                            </label>
                                            <input
                                                type="text"
                                                id="journal_title"
                                                name="journal_title"
                                                value={data.journal_title}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.journal_title}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="volume"
                                                className="block font-medium text-gray-700"
                                            >
                                                Volume
                                            </label>
                                            <input
                                                type="number"
                                                id="volume"
                                                name="volume"
                                                value={data.volume}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.volume}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="number"
                                                className="block font-medium text-gray-700"
                                            >
                                                Number
                                            </label>
                                            <input
                                                type="number"
                                                id="number"
                                                name="number"
                                                value={data.number}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.number}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="pages"
                                                className="block font-medium text-gray-700"
                                            >
                                                Pages
                                            </label>
                                            <input
                                                type="text"
                                                id="Pages"
                                                name="Pages"
                                                value={data.Pages}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.Pages}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {data.type === "Proceeding" && (
                                    <>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="doi"
                                                className="block font-medium text-gray-700"
                                            >
                                                DOI
                                            </label>
                                            <input
                                                type="text"
                                                id="doi"
                                                name="doi"
                                                value={data.doi}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.doi}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="proceeding_title"
                                                className="block font-medium text-gray-700"
                                            >
                                                Proceeding Title
                                            </label>
                                            <input
                                                type="text"
                                                id="proceeding_title"
                                                name="proceeding_title"
                                                value={data.proceeding_title}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.proceeding_title}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="volume"
                                                className="block font-medium text-gray-700"
                                            >
                                                Volume
                                            </label>
                                            <input
                                                type="number"
                                                id="volume"
                                                name="volume"
                                                value={data.volume}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.volume}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="editors"
                                                className="block font-medium text-gray-700"
                                            >
                                                Editors
                                            </label>
                                            <input
                                                type="text"
                                                id="editors"
                                                name="editors"
                                                value={data.editors}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.editors}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="publishing_house"
                                                className="block font-medium text-gray-700"
                                            >
                                                Publishing House
                                            </label>
                                            <input
                                                type="text"
                                                id="publishing_house"
                                                name="publishing_house"
                                                value={data.publishing_house}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.publishing_house}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="pages"
                                                className="block font-medium text-gray-700"
                                            >
                                                Pages
                                            </label>
                                            <input
                                                type="text"
                                                id="Pages"
                                                name="Pages"
                                                value={data.Pages}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.Pages}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {data.type === "Conference" && (
                                    <>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="doi"
                                                className="block font-medium text-gray-700"
                                            >
                                                DOI
                                            </label>
                                            <input
                                                type="text"
                                                id="doi"
                                                name="doi"
                                                value={data.doi}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.doi}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="conference_title"
                                                className="block font-medium text-gray-700"
                                            >
                                                Conference Title
                                            </label>
                                            <input
                                                type="text"
                                                id="conference_title"
                                                name="conference_title"
                                                value={data.conference_title}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.conference_title}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="conference_location"
                                                className="block font-medium text-gray-700"
                                            >
                                                Conference Location
                                            </label>
                                            <input
                                                type="text"
                                                id="conference_location"
                                                name="conference_location"
                                                value={data.conference_location}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.conference_location}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="pages"
                                                className="block font-medium text-gray-700"
                                            >
                                                Pages
                                            </label>
                                            <input
                                                type="text"
                                                id="Pages"
                                                name="Pages"
                                                value={data.Pages}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.Pages}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {data.type === "Chapter" && (
                                    <>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="isbn"
                                                className="block font-medium text-gray-700"
                                            >
                                                ISBN
                                            </label>
                                            <input
                                                type="text"
                                                id="isbn"
                                                name="isbn"
                                                value={data.isbn}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.isbn}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="book_title"
                                                className="block font-medium text-gray-700"
                                            >
                                                Book Title
                                            </label>
                                            <input
                                                type="text"
                                                id="book_title"
                                                name="book_title"
                                                value={data.book_title}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.book_title}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="editors"
                                                className="block font-medium text-gray-700"
                                            >
                                                Editors
                                            </label>
                                            <input
                                                type="text"
                                                id="editors"
                                                name="editors"
                                                value={data.editors}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.editors}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="edition"
                                                className="block font-medium text-gray-700"
                                            >
                                                Edition
                                            </label>
                                            <input
                                                type="text"
                                                id="edition"
                                                name="edition"
                                                value={data.edition}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.edition}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="publishing_house"
                                                className="block font-medium text-gray-700"
                                            >
                                                Publishing House
                                            </label>
                                            <input
                                                type="text"
                                                id="publishing_house"
                                                name="publishing_house"
                                                value={data.publishing_house}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.publishing_house}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="country"
                                                className="block font-medium text-gray-700"
                                            >
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                id="country"
                                                name="country"
                                                value={data.country}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.country}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="pages"
                                                className="block font-medium text-gray-700"
                                            >
                                                Pages
                                            </label>
                                            <input
                                                type="text"
                                                id="Pages"
                                                name="Pages"
                                                value={data.Pages}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.Pages}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {data.type === "Book" && (
                                    <>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="isbn"
                                                className="block font-medium text-gray-700"
                                            >
                                                ISBN
                                            </label>
                                            <input
                                                type="text"
                                                id="isbn"
                                                name="isbn"
                                                value={data.isbn}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.isbn}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="edition"
                                                className="block font-medium text-gray-700"
                                            >
                                                Edition
                                            </label>
                                            <input
                                                type="text"
                                                id="edition"
                                                name="edition"
                                                value={data.edition}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.edition}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="publishing_house"
                                                className="block font-medium text-gray-700"
                                            >
                                                Publishing House
                                            </label>
                                            <input
                                                type="text"
                                                id="publishing_house"
                                                name="publishing_house"
                                                value={data.publishing_house}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                            <p className="text-red-500 text-sm">
                                                {errors.publishing_house}
                                            </p>
                                        </div>
                                    </>
                                )}

                                <div className="mt-4">
                                    <label
                                        htmlFor="title"
                                        className="block font-medium text-gray-700"
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="description"
                                        className="block font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    {/* Add error message if necessary */}
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor="url"
                                        className="block font-medium text-gray-700"
                                    >
                                        URL
                                    </label>
                                    <input
                                        type="url" // Change type to "url"
                                        id="url"
                                        name="url"
                                        value={data.url}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    {/* Add error message if necessary */}
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor="material"
                                        className="block font-medium text-gray-700"
                                    >
                                        Material
                                    </label>
                                    <input
                                        type="text"
                                        id="material"
                                        name="material"
                                        value={data.material}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    {/* Add error message if necessary */}
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor="year_publication"
                                        className="block font-medium text-gray-700"
                                    >
                                        Year of Publication
                                    </label>
                                    <input
                                        type="date" // Change type to "date"
                                        id="year_publication"
                                        name="year_publication"
                                        value={data.year_publication}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    {/* Add error message if necessary */}
                                </div>

                                <div className="mt-4 pt-4 pb-8">
                                    <h2 className="font-bold text-lg text-gray-900 ">
                                        Scientific Productions Members :
                                    </h2>
                                </div>

                                <div className="mb-8 relative">
                                    <div className="flex justify-between mb-2">
                                        <InputLabel
                                            htmlFor="in_lab_user_ids"
                                            value="In Lab Users:"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddUser}
                                            className="hover:bg-black-600 hover:text-white-500 font-bold py-2 px-4 rounded-full focus:outline-none flex items-center"
                                        >
                                            <FiPlus className="mr-2" />
                                            Add User
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-full">
                                            <table className="w-full">
                                                <tbody>
                                                    {inLabUsers.map(
                                                        (user, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b border-gray-200"
                                                            >
                                                                <td className="py-2">
                                                                    <label
                                                                        htmlFor={`labUser-${index}`}
                                                                        className="block font-medium text-gray-700"
                                                                    >
                                                                        Lab User{" "}
                                                                        {index +
                                                                            1}
                                                                    </label>
                                                                    <select
                                                                        id={`labUser-${index}`}
                                                                        name={`labUser-${index}`}
                                                                        value={
                                                                            inLabUsers[
                                                                                index
                                                                            ]
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handleLabUserNameChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                            const selectedUserId =
                                                                                e
                                                                                    .target
                                                                                    .value;
                                                                            const updatedLabUserIds =
                                                                                [
                                                                                    ...data.in_lab_user_ids,
                                                                                ];
                                                                            updatedLabUserIds[
                                                                                index
                                                                            ] =
                                                                                selectedUserId;
                                                                            setData(
                                                                                "in_lab_user_ids",
                                                                                updatedLabUserIds
                                                                            );
                                                                        }}
                                                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            lab
                                                                            user
                                                                        </option>
                                                                        {/* Populate select options with available lab members */}
                                                                        {lab_members.map(
                                                                            (
                                                                                member
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        member.id
                                                                                    }
                                                                                    value={
                                                                                        member
                                                                                            .user
                                                                                            .id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        member
                                                                                            .user
                                                                                            .first_name
                                                                                    }{" "}
                                                                                    {
                                                                                        member
                                                                                            .user
                                                                                            .last_name
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="py-2 px-3 pt-7 ">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemoveUser(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-700 focus:outline-none p-2 rounded-full"
                                                                    >
                                                                        <FiTrash2 />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                            <InputError
                                                message={errors.in_lab_user_ids}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8 relative">
                                    <div className="flex justify-between mb-2">
                                        <InputLabel
                                            htmlFor="in_lab_user_ids"
                                            value="Out Lab Users:"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleOutAddUser}
                                            className="hover:bg-black-600 hover:text-white-500 font-bold py-2 px-4 rounded-full focus:outline-none flex items-center"
                                        >
                                            <FiPlus className="mr-2" />
                                            Add User
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-full">
                                            <table className="w-full">
                                                <tbody>
                                                    {outLabUsers.map(
                                                        (user, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b border-gray-200"
                                                            >
                                                                <td className="py-2">
                                                                    <label
                                                                        htmlFor={`outsideUser-${index}`}
                                                                        className="block font-medium text-gray-700"
                                                                    >
                                                                        User
                                                                        Outside
                                                                        the Lab{" "}
                                                                        {index +
                                                                            1}
                                                                    </label>
                                                                    <div className="mt-4">
                                                                        <InputLabel
                                                                            htmlFor={`establishment-${index}`}
                                                                            value="Establishment"
                                                                        />
                                                                        <select
                                                                            id={`establishment-${index}`}
                                                                            name={`establishment-${index}`}
                                                                            value={
                                                                                establishments[
                                                                                    index
                                                                                ]
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleEstablishmentChange(
                                                                                    e,
                                                                                    index
                                                                                )
                                                                            }
                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                                        >
                                                                            <option value="">
                                                                                Select
                                                                                Establishment
                                                                            </option>
                                                                            <option value="University">
                                                                                University
                                                                            </option>
                                                                            <option value="Private">
                                                                                Private
                                                                            </option>
                                                                            <option value="Public">
                                                                                Public
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                    {establishments[
                                                                        index
                                                                    ] && (
                                                                        <div className="mt-4">
                                                                            <InputLabel
                                                                                htmlFor={`lab-${index}`}
                                                                                value="Lab"
                                                                            />
                                                                            <select
                                                                                id={`lab-${index}`}
                                                                                name={`lab-${index}`}
                                                                                value={
                                                                                    selectedLabs[
                                                                                        index
                                                                                    ]
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleLabChange(
                                                                                        e,
                                                                                        index
                                                                                    )
                                                                                }
                                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                                            >
                                                                                <option value="">
                                                                                    Select
                                                                                    Lab
                                                                                </option>
                                                                                {labs
                                                                                    .filter(
                                                                                        (
                                                                                            lab
                                                                                        ) =>
                                                                                            lab.establishment ===
                                                                                            establishments[
                                                                                                index
                                                                                            ]
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            lab
                                                                                        ) => (
                                                                                            <option
                                                                                                key={
                                                                                                    lab.id
                                                                                                }
                                                                                                value={
                                                                                                    lab.id
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    lab.title
                                                                                                }
                                                                                            </option>
                                                                                        )
                                                                                    )}
                                                                            </select>
                                                                        </div>
                                                                    )}
                                                                    {selectedLabs[
                                                                        index
                                                                    ] && (
                                                                        <div className="mt-4">
                                                                            <InputLabel
                                                                                htmlFor={`labMember-${index}`}
                                                                                value="Lab Member"
                                                                            />
                                                                            <select
                                                                                id={`labMember-${index}`}
                                                                                name={`labMember-${index}`}
                                                                                value={
                                                                                    outLabUsers[
                                                                                        index
                                                                                    ]
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    const selectedUserId =
                                                                                        e
                                                                                            .target
                                                                                            .value;
                                                                                    const updatedOutLabUserIds =
                                                                                        [
                                                                                            ...data.out_lab_user_ids,
                                                                                        ];
                                                                                    updatedOutLabUserIds[
                                                                                        index
                                                                                    ] =
                                                                                        selectedUserId;
                                                                                    setData(
                                                                                        "out_lab_user_ids",
                                                                                        updatedOutLabUserIds
                                                                                    );
                                                                                    handleLabUserNameOutChange(
                                                                                        e,
                                                                                        index
                                                                                    );
                                                                                }}
                                                                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                                                            >
                                                                                <option value="">
                                                                                    Select
                                                                                    user
                                                                                    outside
                                                                                    lab
                                                                                </option>
                                                                                {lab_members_all
                                                                                    .filter(
                                                                                        (
                                                                                            member
                                                                                        ) =>
                                                                                            member.lab_id ==
                                                                                            selectedLabs[
                                                                                                index
                                                                                            ]
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            member
                                                                                        ) => (
                                                                                            <option
                                                                                                key={
                                                                                                    member.id
                                                                                                }
                                                                                                value={
                                                                                                    member
                                                                                                        .user
                                                                                                        .id
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    member
                                                                                                        .user
                                                                                                        .first_name
                                                                                                }{" "}
                                                                                                {
                                                                                                    member
                                                                                                        .user
                                                                                                        .last_name
                                                                                                }
                                                                                            </option>
                                                                                        )
                                                                                    )}
                                                                            </select>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="py-2 px-3 flex items-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemoveOutUser(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-700 focus:outline-none p-2 rounded-full"
                                                                    >
                                                                        <FiTrash2
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                            <InputError
                                                message={errors.in_lab_user_ids}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="mb-8 relative">
                                    <div className="flex justify-between mb-2">
                                        <InputLabel
                                            htmlFor="in_lab_user_ids"
                                            value="External Lab Members:"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddExternalUser}
                                            className="hover:bg-black-600 hover:text-white-500 font-bold py-2 px-4 rounded-full focus:outline-none flex items-center"
                                        >
                                            <FiPlus className="mr-2" />
                                            Add User
                                        </button>
                                    </div>

                                    {users.length > 0 && (
                                        <div className="flex items-center">
                                            <div className="w-full">
                                                <table className="w-full">
                                                    <tbody>
                                                        {users.map((user, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b border-gray-200"
                                                            >
                                                                <td className="py-2">
                                                                    <label
                                                                        htmlFor={`f_name_${index}`}
                                                                        className="block font-medium text-gray-700"
                                                                    >
                                                                        First Name
                                                                    </label>
                                                                    <input
                                                                        id={`f_name_${index}`}
                                                                        name={`f_name_${index}`}
                                                                        value={user.f_name}
                                                                        onChange={(e) =>
                                                                            handleExternalUserChange(
                                                                                index,
                                                                                "f_name",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                                                    />
                                                                    <label
                                                                        htmlFor={`l_name_${index}`}
                                                                        className="block font-medium text-gray-700 mt-2"
                                                                    >
                                                                        Last Name
                                                                    </label>
                                                                    <input
                                                                        id={`l_name_${index}`}
                                                                        name={`l_name_${index}`}
                                                                        value={user.l_name}
                                                                        onChange={(e) =>
                                                                            handleExternalUserChange(
                                                                                index,
                                                                                "l_name",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                                                    />
                                                                    <label
                                                                        htmlFor={`email_${index}`}
                                                                        className="block font-medium text-gray-700 mt-2"
                                                                    >
                                                                        Email
                                                                    </label>
                                                                    <input
                                                                        id={`email_${index}`}
                                                                        name={`email_${index}`}
                                                                        value={user.email}
                                                                        onChange={(e) =>
                                                                            handleExternalUserChange(
                                                                                index,
                                                                                "email",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                                                    />
                                                                </td>
                                                                <td className="py-2 px-3 pt-7 ">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemoveExternalUser(index)
                                                                        }
                                                                        className="text-red-600 hover:text-red-700 focus:outline-none p-2 rounded-full"
                                                                    >
                                                                        <FiTrash2 />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <PrimaryButton type="submit">
                                    Submit
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default AddProject;
