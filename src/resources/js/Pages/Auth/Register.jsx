import { useEffect, useContext } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { LanguageContext } from "@/lib/LanguageContext";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        last_name: "",
    });

    const { language } = useContext(LanguageContext);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"));
    };

    return (
        <AuthLayout>
           {language === "en" ? (
                <Head title="Register" />
            ) : language === "ar" ? (
                <Head title="انشاء حساب" />
            ) : (
                <Head title="Inscrivez-vous" />
            )}

            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold">
                    {language === "en"
                        ? "Register"
                        : language === "ar"
                        ? "انشاء حساب"
                        : "Inscrivez-vous"}
                </h1>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="grid gap-4">
                    <Label htmlFor="email">
                        {" "}
                        {language === "en"
                            ? "First Name"
                            : language === "ar"
                            ? "اللقب"
                            : "Nom"}
                    </Label>
                    <Input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={data.first_name}
                        autoComplete="first_name"
                        placeholder={
                            language === "en"
                                ? "First Name"
                                : language === "ar"
                                ? "اللقب"
                                : "Nom"
                        }
                       
                        onChange={(e) => setData("first_name", e.target.value)}
                        required
                    />
                    <InputError message={errors.first_name} />
                </div>

                <div className="grid gap-4">
                    <Label htmlFor="email">
                        {language === "en"
                            ? "Last Name"
                            : language === "ar"
                            ? "الاسم"
                            : "Prenom"}
                    </Label>
                    <Input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={data.last_name}
                        placeholder={
                            language === "en"
                                ? "Last Name"
                                : language === "ar"
                                ? "الاسم"
                                : "Prenom"
                        }
                        autoComplete="last_name"
                       
                        onChange={(e) => setData("last_name", e.target.value)}
                        required
                    />
                    <InputError message={errors.last_name} />
                </div>

                <div className="grid gap-4">
                    <Label htmlFor="email">
                        {" "}
                        {language === "en"
                            ? "Email"
                            : language === "ar"
                            ? "البريد الالكتروني"
                            : "Email"}
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder={
                            language === "en"
                                ? "Enter your email"
                                : language === "ar"
                                ? "أدخل بريدك الإلكتروني"
                                : "Tapez votre Email"
                        }
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-4">
                    <Label htmlFor="password">
                        {" "}
                        {language === "en"
                            ? "Password"
                            : language === "ar"
                            ? "كلمة السر"
                            : "Mot de passe"}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder={
                            language === "en"
                                ? "Enter your Password"
                                : language === "ar"
                                ? "أدخل كلمة السر"
                                : "Tapez votre mot de passe"
                        }
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                </div>

                <div className="grid gap-4">
                    <Label htmlFor="password">
                        {" "}
                        {language === "en"
                            ? "Confirm Password"
                            : language === "ar"
                            ? "تأكيد  كلمة السر"
                            : "Confirmer Le Mot de passe"}
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder={
                            language === "en"
                                ? "Confirm Password"
                                : language === "ar"
                                ? "تأكيد  كلمة السر"
                                : "Confirmer Le Mot de passe"
                        }
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full  text-white "
                    disabled={processing}
                >
                    {language === "en"
                        ? processing
                            ? "Registering..."
                            : "Register"
                        : language === "ar"
                        ? processing
                            ? "جاري انشاء الحساب"
                            : "انشاء الحساب"
                        : processing
                        ? "Inscrivez-vous..."
                        : "Inscrivez-vous"}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                {language === "en"
                    ? "Already Have An Account? "
                    : language === "ar"
                    ? "هل لديك حساب؟"
                    : "Vous avez déjà un compte?"}{" "}
                <Link href="/login" className="text-gray-600 hover:underline">
                    {language === "en"
                        ? "Login"
                        : language === "ar"
                        ? "تسجيل الدخول"
                        : "Connexion"}
                </Link>
            </div>
        </AuthLayout>
    );
}
