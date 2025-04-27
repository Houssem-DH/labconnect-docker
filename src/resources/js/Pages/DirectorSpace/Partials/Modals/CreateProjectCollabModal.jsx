import React, { useState, useContext } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { LanguageContext } from "@/lib/LanguageContext";
import { FiTrash2, FiPlus } from "react-icons/fi";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";

const AddLabMemberModal = ({ onClose, isOpen, lab }) => {
    const { language } = useContext(LanguageContext);
    const { data, setData, post, processing, errors, reset } = useForm({
      
        domain: [],
        title: "",
        problematic: "",
        objective: "",
    });


    const [domains, setDomains] = useState([]);

    const handleAddDomains = () => {
        setDomains([...domains, ""]);
    };

    const handleRemoveDomains = (index) => {
        const updatedDomain = [...domain];
        updatedDomain.splice(index, 1);
        setSubResearchArea(updatedDomain);

        const updatedDoms = [...data.domain];
        updatedDoms.splice(index, 1);
        setData("domain", updatedDoms);
    };

    const handleDomainChange = (e, index) => {
        const updatedDomain = [...domains];
        updatedDomain[index] = e.target.value;
        setDomains(updatedDomain);

        const updatedDoms = [...data.domain];
        updatedDoms[index] = e.target.value;
        setData("domain", updatedDoms);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("lab.project.collab.request.insert", { id: lab.id }), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>Create Project Collab Request</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-gray-900">
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            

                        <div className="mt-4 mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="sub_research_area">Domains:</Label>
                            <Button
                                type="button"
                                onClick={handleAddDomains}
                                variant="outline"
                                className="flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Add Domain
                            </Button>
                        </div>
                        <div>
                            <table className="w-full">
                                <tbody>
                                    {domains.map((result, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="py-2">
                                                <Input
                                                    type="text"
                                                    value={result}
                                                    onChange={(e) => handleDomainChange(e, index)}
                                                    className="w-full"
                                                    placeholder="Enter Domain"
                                                />
                                            </td>
                                            <td className="py-2 px-3 text-center">
                                                <Button
                                                    type="button"
                                                    onClick={() => handleRemoveDomains(index)}
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <InputError message={errors.domain} className="mt-2" />
                        </div>
                        </div>

                            <Label htmlFor="title">
                                {language === "en"
                                    ? "Title *"
                                    : language === "ar"
                                    ? "عنوان"
                                    : "Titre *"}
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
                                        ? "عنوان"
                                        : "Titre"
                                }
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.title} />

                            <Label htmlFor="problematic">
                                {language === "en"
                                    ? "Problematic *"
                                    : language === "ar"
                                    ? "الإشكالية"
                                    : "Problématique *"}
                            </Label>
                            <Textarea
                                id="problematic"
                                name="problematic"
                                value={data.problematic}
                                autoComplete="problematic"
                                placeholder={
                                    language === "en"
                                        ? "Problematic"
                                        : language === "ar"
                                        ? "الإشكالية"
                                        : "Problématique"
                                }
                                onChange={(e) =>
                                    setData("problematic", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.problematic} />

                            <Label htmlFor="objective">
                                {language === "en"
                                    ? "Objective *"
                                    : language === "ar"
                                    ? "الهدف"
                                    : "Objectif *"}
                            </Label>
                            <Textarea
                                id="objective"
                                name="objective"
                                value={data.objective}
                                autoComplete="objective"
                                placeholder={
                                    language === "en"
                                        ? "Objective"
                                        : language === "ar"
                                        ? "الهدف"
                                        : "Objectif"
                                }
                                onChange={(e) =>
                                    setData("objective", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.objective} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-white"
                            disabled={processing}
                        >
                            {language === "en"
                                ? "Create  Project Collab"
                                : language === "ar"
                                ? "انشاء الحساب"
                                : "Inscrivez-vous"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddLabMemberModal;
