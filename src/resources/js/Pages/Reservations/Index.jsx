import React, { useContext, useState, useEffect } from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Clock,
    CheckCircle2,
    XCircle,
    Plus,
    RefreshCw,
    ArrowRight,
    Search,
    HelpCircle,
} from "lucide-react";

const statusIcons = {
    clock: Clock,
    "check-circle": CheckCircle2,
    "x-circle": XCircle,
    "help-circle": HelpCircle,
};

export default function MyReservations({ auth, reservations, filters }) {
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const showDetails = (reservation) => {
        setSelectedReservation(reservation);
        setIsDialogOpen(true);
    };
    const handleFilter = (key, value) => {
        router.get(
            route("reservations.index"),
            {
                ...filters,
                [key]: value === "all" ? undefined : value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <Layout user={auth.user}>
            <Head title="My Reservations" />

            {/* Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Reservation Details</DialogTitle>
                    </DialogHeader>

                    {selectedReservation && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Reservation ID
                                    </label>
                                    <p className="font-medium">
                                        #{selectedReservation.id?.slice(0, 8)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Status
                                    </label>
                                    <Badge
                                        className={`${selectedReservation.status_badge?.color} rounded-full px-3 py-1 text-sm w-fit`}
                                    >
                                        {
                                            selectedReservation.status_badge
                                                ?.label
                                        }
                                    </Badge>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Material
                                    </label>
                                    <p className="font-medium">
                                        {selectedReservation.material?.name ||
                                            "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Date & Time
                                    </label>
                                    <p className="font-medium">
                                        {selectedReservation.created_at ||
                                            "Unknown date"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Amount
                                    </label>
                                    <p className="font-medium">
                                        {selectedReservation.formatted_amount}{" "}
                                        {selectedReservation.currency}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Payment Method
                                    </label>
                                    <p className="font-medium">Credit Card</p>
                                </div>
                            </div>

                            {/* Add more fields as needed */}
                            <div className="col-span-2">
                                <label className="text-sm text-muted-foreground">
                                    Additional Notes
                                </label>
                                <p className="font-medium text-gray-600">
                                    {selectedReservation.notes ||
                                        "No additional notes provided"}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <div className="max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Equipment Reservations
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your laboratory equipment bookings and track
                            real-time status
                        </p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Search reservations..."
                        value={filters.search || ""}
                        onChange={(e) => handleFilter("search", e.target.value)}
                        className="bg-background"
                        startIcon={Search}
                    />
                    <Select
                        value={filters.status || "all"}
                        onValueChange={(value) => handleFilter("status", value)}
                    >
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Main Card */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-0">
                    <CardHeader className="bg-muted/50 border-b">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold">
                                    Reservation History
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Showing {reservations.total} results
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh List
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-y-auto">
                            <Table className="relative">
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow>
                                        <TableHead className="w-[120px]">
                                            Reservation ID
                                        </TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Material</TableHead>
                                        <TableHead className="text-right">
                                            Amount
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservations.data.map((reservation) => {
                                        const IconComponent =
                                            statusIcons[
                                                reservation.status_badge?.icon
                                            ] || HelpCircle;

                                        return (
                                            <TableRow
                                                key={reservation.id}
                                                className="group hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    <span className="text-primary">
                                                        {reservation.id
                                                            ? `#${String(
                                                                  reservation.id
                                                              ).slice(0, 8)}`
                                                            : "N/A"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {reservation.created_at ||
                                                                "Unknown date"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium flex items-center gap-3">
                                                    {reservation.material
                                                        ?.picture && (
                                                        <img
                                                            src={`storage/${reservation.material.picture}`}
                                                            alt={
                                                                reservation
                                                                    .material
                                                                    .name
                                                            }
                                                            className="w-8 h-8 rounded-md object-cover"
                                                        />
                                                    )}
                                                    {reservation.material
                                                        ?.name || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-right font-medium tabular-nums">
                                                    <span className="text-foreground">
                                                        {reservation.formatted_amount ||
                                                            "0.00"}
                                                    </span>
                                                    <span className="text-muted-foreground ml-1.5">
                                                        {reservation.currency ||
                                                            ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`rounded-full px-3 py-1 text-sm font-medium flex items-center w-fit gap-1.5 ${
                                                            reservation
                                                                .status_badge
                                                                ?.color ||
                                                            "bg-gray-100"
                                                        } ${
                                                            reservation
                                                                .status_badge
                                                                ?.label ===
                                                            "Pending"
                                                                ? "text-amber-800 hover:bg-amber-200"
                                                                : reservation
                                                                      .status_badge
                                                                      ?.label ===
                                                                  "Confirmed"
                                                                ? "text-green-800 hover:bg-green-200"
                                                                : reservation
                                                                      .status_badge
                                                                      ?.label ===
                                                                  "Cancelled"
                                                                ? "text-red-800 hover:bg-red-200"
                                                                : reservations
                                                                      .status_badge
                                                                      ?.label ===
                                                                  "Completed"
                                                                ? "text-blue-800 hover:bg-blue-200"
                                                                : "text-gray-800 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        <IconComponent className="w-4 h-4" />
                                                        {reservation
                                                            .status_badge
                                                            ?.label ||
                                                            "Unknown"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                        onClick={() =>
                                                            showDetails(
                                                                reservation
                                                            )
                                                        }
                                                    >
                                                        Details
                                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>

                    {/* Pagination */}
                    <CardFooter className="bg-muted/50 border-t py-3">
                        <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                                Page {reservations.current_page} of{" "}
                                {reservations.last_page}
                            </span>
                            <div className="flex gap-1">
                                {reservations.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? "default" : "ghost"
                                        }
                                        size="sm"
                                        className={
                                            !link.url
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }
                                        disabled={!link.url || link.active}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
}
