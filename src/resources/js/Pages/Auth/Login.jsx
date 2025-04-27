import { useEffect, useContext } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { LanguageContext } from "@/lib/LanguageContext";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const { language } = useContext(LanguageContext);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <AuthLayout>
            {language === "en" ? (
                <Head title="Login" />
            ) : language === "ar" ? (
                <Head title="تسجيل الدخول" />
            ) : (
                <Head title="Connexion" />
            )}

            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold">
                    {" "}
                    {language === "en"
                        ? "Login"
                        : language === "ar"
                        ? "تسجيل الدخول"
                        : "Connexion"}
                </h1>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-6">
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
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-gray-600  hover:underline"
                        >
                            {language === "en"
                                ? "Forgot your password?"
                                : language === "ar"
                                ? "نسيت كلمة السر؟"
                                : "Mot de passe oublié?"}
                        </Link>
                    )}
                </div>
                <div className="flex items-center">
                    <Checkbox
                        id="remember"
                        name="remember"
                        onChange={(e) => setData("remember", e.target.checked)}
                        className="mr-2"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                        {language === "en"
                            ? "Remember me"
                            : language === "ar"
                            ? "تذكرنى"
                            : "Souviens-toi de moi"}
                    </Label>
                </div>
                <Button
                    type="submit"
                    className="w-full  text-white"
                    disabled={processing}
                >
                    {language === "en"
                        ? processing
                            ? "Logging in..."
                            : "Login"
                        : language === "ar"
                        ? processing
                            ? "جاري التسجيل..."
                            : "تسجيل الدخول"
                        : processing
                        ? "Connexion..."
                        : "Connexion"}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                {language === "en"
                    ? "Don't have an account?"
                    : language === "ar"
                    ? "ليس لديك حساب؟"
                    : "Vous n'avez pas de compte ?"}{" "}
                <Link
                    href="/register"
                    className="text-gray-600 hover:underline"
                >
                    {language === "en"
                        ? "Register Here"
                        : language === "ar"
                        ? "سجل هنا"
                        : "Inscrivez-vous ici"}
                </Link>
            </div>
        </AuthLayout>
    );
}
