import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Info,
    ExternalLink,
    BadgeAlert,
} from "lucide-react";
import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";

export default function PaymentStatus({
    status = "unknown",
    payment,
    auth,
    notifications,
    labMember,
    users,
}) {
    const statusConfig = {
        paid: {
            icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
            color: "bg-green-100/30 text-green-700",
            title: "Payment Successful",
            progress: 100,
        },
        failed: {
            icon: <XCircle className="w-8 h-8 text-red-600" />,
            color: "bg-red-100/30 text-red-700",
            title: "Payment Failed",
            progress: 50,
        },
        canceled: {
            icon: <XCircle className="w-8 h-8 text-amber-600" />,
            color: "bg-amber-100/30 text-amber-700",
            title: "Payment Canceled",
            progress: 30,
        },
        pending: {
            icon: <Clock className="w-8 h-8 text-blue-600 animate-pulse" />,
            color: "bg-blue-100/30 text-blue-700",
            title: "Payment Processing",
            progress: 70,
        },
        unknown: {
            icon: <BadgeAlert className="w-8 h-8 text-gray-600" />,
            color: "bg-gray-100/30 text-gray-700",
            title: "Payment Status Unknown",
            progress: 0,
        },
    };

    const { icon, color, title, progress } =
        statusConfig[status] || statusConfig.unknown;

    return (
        <Layout
            user={auth.user}
            notifications={notifications.list}
            notifications_count={notifications.count}
            labMember={labMember}
            users={users.users}
            chat_groups={users.chat_groups}
        >
            <Head title="Payment Status" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-xl p-8 space-y-8 shadow-lg rounded-2xl">
                    {/* Status Header */}
                    <div className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`p-4 rounded-full ${color}`}>
                                {icon}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {title}
                            </h1>
                            <Progress
                                value={progress}
                                className="h-2 w-[60%]"
                            />
                        </div>
                    </div>

                    {/* Payment Details */}
                    {payment ? (
                        <div className="space-y-6">
                            <div className="bg-gray-100/50 p-6 rounded-xl space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Amount
                                        </p>
                                        <p className="text-2xl font-semibold">
                                            {payment.amount}
                                            <span className="text-base text-gray-500 ml-1">
                                                {payment.currency}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Date
                                        </p>
                                        <p className="font-medium">
                                            {new Date(
                                                payment.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Payment ID
                                        </p>
                                        <p className="font-medium break-all">
                                            {payment.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Reservation ID
                                        </p>
                                        <p className="font-medium">
                                            {payment.material_reservation_id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-1 gap-4">
                                <Button asChild className="h-12">
                                    <Link href={route("reservations.index")}>
                                        View My Reservations
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="h-12"
                                    asChild
                                >
                                    <Link href={route("home")}>
                                        Return to Home
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-6 bg-red-50/50 rounded-xl space-y-4">
                            <XCircle className="w-12 h-12 text-red-600 mx-auto" />
                            <h2 className="text-xl font-semibold text-red-700">
                                Payment Not Found
                            </h2>
                            <p className="text-gray-600">
                                The payment record could not be located. Please
                                contact support if this issue persists.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" asChild>
                                    <Link href={route("home")}>
                                        Return to Home
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Support Info */}
                    <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <p>
                            Need help? Contact our support team at
                            support@example.com
                        </p>
                        {payment && (
                            <p className="mt-2">Reference ID: {payment.id}</p>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
