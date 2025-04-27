import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useContext, useState } from "react"; // Import useContext and useState

export default function RequestLab({ className = "" }) {
   

    const [wilayaOptions, setWilayaOptions] = useState([
        "Adrar",
        "Chlef",
        "Laghouat",
        "Oum El Bouaghi",
        "Batna",
        "Béjaïa",
        "Biskra",
        "Béchar",
        "Blida",
        "Bouira",
        "Tamanrasset",
        "Tébessa",
        "Tlemcen",
        "Tiaret",
        "Tizi Ouzou",
        "Algiers",
        "Djelfa",
        "Jijel",
        "Sétif",
        "Saïda",
        "Skikda",
        "Sidi Bel Abbès",
        "Annaba",
        "Guelma",
        "Constantine",
        "Médéa",
        "Mostaganem",
        "M'Sila",
        "Mascara",
        "Ouargla",
        "Oran",
        "El Bayadh",
        "Illizi",
        "Bordj Bou Arréridj",
        "Boumerdès",
        "El Tarf",
        "Tindouf",
        "Tissemsilt",
        "El Oued",
        "Khenchela",
        "Souk Ahras",
        "Tipaza",
        "Mila",
        "Aïn Defla",
        "Naâma",
        "Aïn Témouchent",
        "Ghardaïa",
        "Relizane",
        "El M'Ghair",
        "El Menéa",
        "Ouled Djellal",
        "Beni Abbès",
        "Timimoun",
        "Touggourt",
        "Djanet",
        "In Salah",
        "In Guezzam",
    ]);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            labname: "",
            establishment: "",
            description: "",
            domain: "",
            type: "",
            wilaya: "",
            proofFile: null,
        });

    const submit2 = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("labname", data.labname);
        formData.append("establishment", data.establishment);
        formData.append("description", data.description);
        formData.append("domain", data.domain);
        formData.append("type", data.type);
        formData.append("wilaya", data.wilaya);
        formData.append("proofFile", data.proofFile);
        // Adjust the route according to your application routes
        post(route("request.lab"), formData);
    };

    return (
        <section className={`${className} `}>
            <header>
                
                <p className="mt-1 text-sm text-gray-600">
                    Fill in the required information to request lab access.
                </p>
            </header>
            <form
                onSubmit={submit2}
                encType="multipart/form-data"
                className="mt-6 space-y-6"
            >
                <div>
                    <InputLabel htmlFor="labname" value="Lab Name" />
                    <TextInput
                        id="labname"
                        className="mt-1 block w-full"
                        value={data.labname}
                        onChange={(e) => setData("labname", e.target.value)}
                        required
                        isFocused
                        autoComplete="off"
                    />
                    <InputError className="mt-2" message={errors.labname} />
                </div>

                <div>
                    <InputLabel htmlFor="establishment" value="Establishment" />
                    <TextInput
                        id="establishment"
                        className="mt-1 block w-full"
                        value={data.establishment}
                        onChange={(e) =>
                            setData("establishment", e.target.value)
                        }
                        required
                        autoComplete="off"
                    />
                    <InputError
                        className="mt-2"
                        message={errors.establishment}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="description" value="Description" />
                    <textarea
                        id="description"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                <div>
                    <InputLabel htmlFor="domain" value="Domain" />
                    <TextInput
                        id="domain"
                        className="mt-1 block w-full"
                        value={data.domain}
                        onChange={(e) => setData("domain", e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <InputError className="mt-2" message={errors.domain} />
                </div>

                <div>
                    <InputLabel htmlFor="type" value="Type" />
                    <select
                        id="type"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.type}
                        onChange={(e) => setData("type", e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="University Lab">University Lab</option>
                        <option value="Private Lab">Private Lab</option>
                        <option value="Goverment Lab">Goverment Lab</option>
                        <option value="Hospital Lab">Hospital Lab</option>
                       
                    </select>
                    <InputError className="mt-2" message={errors.type} />
                </div>

                <div>
                    <InputLabel htmlFor="wilaya" value="Wilaya" />
                    <select
                        id="wilaya"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.wilaya}
                        onChange={(e) => setData("wilaya", e.target.value)}
                        required
                    >
                        <option value="">Select Wilaya</option>
                        {wilayaOptions.map((wilaya) => (
                            <option key={wilaya} value={wilaya}>
                                {wilaya}
                            </option>
                        ))}
                    </select>
                    <InputError className="mt-2" message={errors.wilaya} />
                </div>

                <div>
                    <InputLabel htmlFor="proofFile" value="Proof File" />
                    <input
                        id="proofFile"
                        name="proofFile"
                        type="file"
                        onChange={(e) =>
                            setData("proofFile", e.target.files[0])
                        }
                    />
                    <InputError className="mt-2" message={errors.proofFile} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        Submit Request
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Request Submitted.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
