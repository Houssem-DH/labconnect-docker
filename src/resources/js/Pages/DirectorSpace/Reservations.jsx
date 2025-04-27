import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import {
    CheckCircle,
    Clock,
    XCircle,
    DollarSign,
    Package,
    Calendar,
    MessageSquareText,
    ArrowRight
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const statusConfig = {
    pending_payment: { color: 'bg-amber-100 text-amber-800', icon: Clock },
    accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    canceled: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    payment_failed: { color: 'bg-rose-100 text-rose-800', icon: XCircle },
};

const Reservations = ({ auth, lab, userRole, notifications, paidReservations }) => {
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const showDetails = (reservation) => {
        setSelectedReservation(reservation);
        setIsDialogOpen(true);
    };

    return (
        <Layout 
            user={auth.user} 
            userRole={userRole} 
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="Paid Reservations" />
            
            {/* Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl rounded-lg border-0 shadow-xl">
                    <DialogHeader className="bg-gradient-to-r from-primary to-primary/90 p-6 rounded-t-lg">
                        <DialogTitle className="text-white text-xl font-bold">
                            Reservation Details
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedReservation && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-medium">Material</label>
                                        <p className="font-semibold text-lg">{selectedReservation.material}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-medium">User</label>
                                        <p className="font-semibold">{selectedReservation.user.name}</p>
                                        <p className="text-sm text-gray-600">{selectedReservation.user.email}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-medium">Payment</label>
                                        <p className="font-semibold text-lg">
                                            {selectedReservation.amount} {selectedReservation.currency}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-medium">Status</label>
                                        <Badge className={`${statusConfig[selectedReservation.status]?.color} px-3 py-1 rounded-full`}>
                                           Pending
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 border-t pt-6">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Close
                                </Button>
                                <Button 
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white"
                                    onClick={() => console.log("Answer button clicked")}
                                >
                                    <MessageSquareText className="w-4 h-4 mr-2" />
                                    Answer
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <SpaceLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="shadow-xl rounded-xl border-0">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-800">
                                        Paid Reservations
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {paidReservations.total} paid reservations found
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table className="min-w-full">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="text-gray-600">Material</TableHead>
                                        <TableHead className="text-gray-600">User</TableHead>
                                        <TableHead className="text-gray-600">Date</TableHead>
                                        <TableHead className="text-gray-600">Quantity</TableHead>
                                        <TableHead className="text-gray-600">Amount</TableHead>
                                        <TableHead className="text-gray-600">Status</TableHead>
                                        <TableHead className="text-gray-600">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paidReservations.data.map((reservation) => {
                                        const StatusIcon = statusConfig[reservation.status]?.icon || Clock;
                                        return (
                                            <TableRow key={reservation.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Package className="h-5 w-5 text-primary" />
                                                        <span className="font-medium">{reservation.material}</span>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{reservation.user.name}</span>
                                                        <span className="text-sm text-gray-600">
                                                            {reservation.user.email}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-5 w-5 text-gray-400" />
                                                        {reservation.reservation_date}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    {reservation.quantity}
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-5 w-5 text-green-600" />
                                                        {reservation.amount} {reservation.currency}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge 
                                                        className={`${statusConfig[reservation.status]?.color} rounded-full px-3 py-1 flex items-center gap-2 w-fit`}
                                                    >
                                                        <StatusIcon className="h-4 w-4" />
                                                        {reservation.status.replace(/_/g, ' ')}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="text-primary hover:bg-primary/10"
                                                        onClick={() => showDetails(reservation)}
                                                    >
                                                        <ArrowRight className="h-4 w-4 mr-2" />
                                                        Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    )}
                                </TableBody>
                            </Table>

                            {paidReservations.data.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="mb-4">No paid reservations found</div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="bg-gradient-to-r from-primary/5 to-primary/10 border-t py-4">
                            <div className="w-full flex items-center justify-between text-sm text-gray-600">
                                <span>
                                    Page {paidReservations.current_page} of {paidReservations.last_page}
                                </span>
                                <div className="flex gap-2">
                                    {paidReservations.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'ghost'}
                                            size="sm"
                                            className={`rounded-full ${link.active ? 'bg-primary text-white' : ''}`}
                                            disabled={!link.url || link.active}
                                            onClick={() => link.url && router.get(link.url)}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default Reservations;