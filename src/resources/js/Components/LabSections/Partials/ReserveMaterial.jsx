import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/Components/ui/calendar";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

const ReserveModal = ({ material, isOpen, onClose }) => {
    const { data, setData, post, processing, errors } = useForm({
        material_id: material.id,
        reservation_type: material.reservation_type || "",
        applicant_type: "",
        start_date: "",
        end_date: "",
        quantity: 1,
        reason: "",
        tlp: "",
        adresse_email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("material.reserve", { id: material.id }), {
            onSuccess: () => onClose(),
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen p-6">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        Reserve {material.name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2 text-base">
                        Complete the form below to make your reservation. All
                        fields marked with{" "}
                        <span className="text-red-500">*</span> are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Reservation Type */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="reservation_type"
                                className="font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Reservation Type{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.reservation_type}
                                onValueChange={(value) =>
                                    setData("reservation_type", value)
                                }
                            >
                                <SelectTrigger className="h-12 rounded-lg shadow-sm">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg shadow-lg">
                                    <SelectItem
                                        value="hourly"
                                        className="py-3 hover:bg-gray-50"
                                    >
                                        Hourly
                                    </SelectItem>
                                    <SelectItem
                                        value="daily"
                                        className="py-3 hover:bg-gray-50"
                                    >
                                        Daily
                                    </SelectItem>
                                    <SelectItem
                                        value="weekly"
                                        className="py-3 hover:bg-gray-50"
                                    >
                                        Weekly
                                    </SelectItem>
                                    <SelectItem
                                        value="project"
                                        className="py-3 hover:bg-gray-50"
                                    >
                                        Project Basis
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.reservation_type}
                                className="mt-1"
                            />
                        </div>

                        {/* Applicant Type */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="applicant_type"
                                className="font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Applicant Type{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.applicant_type}
                                onValueChange={(value) =>
                                    setData("applicant_type", value)
                                }
                            >
                                <SelectTrigger className="h-12 rounded-lg shadow-sm">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg shadow-lg">
                                    <SelectItem
                                        value="student"
                                        className="py-3"
                                    >
                                        Student
                                    </SelectItem>
                                    <SelectItem
                                        value="professor"
                                        className="py-3"
                                    >
                                        Professor
                                    </SelectItem>
                                    <SelectItem
                                        value="researcher"
                                        className="py-3"
                                    >
                                        Researcher
                                    </SelectItem>
                                    <SelectItem value="staff" className="py-3">
                                        Staff
                                    </SelectItem>
                                    <SelectItem
                                        value="external"
                                        className="py-3"
                                    >
                                        External
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.applicant_type}
                                className="mt-1"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-gray-700 dark:text-gray-300">
                                Start Date{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-medium rounded-lg shadow-sm",
                                            !data.start_date && "text-gray-400"
                                        )}
                                    >
                                        <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                                        {data.start_date ? (
                                            format(
                                                new Date(data.start_date),
                                                "PPP"
                                            )
                                        ) : (
                                            <span>Select date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-4 rounded-xl shadow-xl border border-gray-200">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            data.start_date
                                                ? new Date(data.start_date)
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            setData(
                                                "start_date",
                                                date
                                                    ? date
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : ""
                                            )
                                        }
                                        initialFocus
                                        fromDate={new Date()}
                                        className="rounded-lg"
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError
                                message={errors.start_date}
                                className="mt-1"
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-gray-700 dark:text-gray-300">
                                End Date <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-medium rounded-lg shadow-sm",
                                            !data.end_date && "text-gray-400"
                                        )}
                                        disabled={!data.start_date}
                                    >
                                        <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                                        {data.end_date ? (
                                            format(
                                                new Date(data.end_date),
                                                "PPP"
                                            )
                                        ) : (
                                            <span>Select date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-4 rounded-xl shadow-xl border border-gray-200">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            data.end_date
                                                ? new Date(data.end_date)
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            setData(
                                                "end_date",
                                                date
                                                    ? date
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : ""
                                            )
                                        }
                                        initialFocus
                                        fromDate={
                                            data.start_date
                                                ? new Date(data.start_date)
                                                : new Date()
                                        }
                                        className="rounded-lg"
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError
                                message={errors.end_date}
                                className="mt-1"
                            />
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="quantity"
                                className="font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Quantity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                id="quantity"
                                min="1"
                                className="h-12 rounded-lg shadow-sm"
                                value={data.quantity}
                                onChange={(e) =>
                                    setData("quantity", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.quantity}
                                className="mt-1"
                            />
                        </div>

                        {/* Telephone */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="tlp"
                                className="font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Phone Number{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="tel"
                                id="tlp"
                                placeholder="05XXXXXXXX"
                                className="h-12 rounded-lg shadow-sm"
                                value={data.tlp}
                                onChange={(e) => setData("tlp", e.target.value)}
                                pattern="^0[0-9]{9}$"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Required format: 05XXXXXXXX (10 digits starting
                                with 0)
                            </p>
                            <InputError message={errors.tlp} className="mt-1" />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8" />

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="reason"
                            className="font-semibold text-gray-700 dark:text-gray-300"
                        >
                            Reason for Reservation{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Explain your requirements in detail..."
                            className="rounded-lg shadow-sm min-h-[120px]"
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                        />
                        <InputError message={errors.reason} className="mt-1" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="adresse_email"
                            className="font-semibold text-gray-700 dark:text-gray-300"
                        >
                            Email Address
                        </Label>
                        <Input
                            type="email"
                            id="adresse_email"
                            placeholder="your.email@example.com"
                            className="h-12 rounded-lg shadow-sm"
                            value={data.adresse_email}
                            onChange={(e) =>
                                setData("adresse_email", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.adresse_email}
                            className="mt-1"
                        />
                    </div>

                    {/* Cost Calculation */}
                    {material.reservation_price && (
                        <div className="bg-blue-50/80 p-6 rounded-xl border border-blue-200 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-blue-800">
                                        Estimated Cost
                                    </h4>
                                    <p className="text-sm text-blue-600 mt-1">
                                        {data.quantity} × DA{" "}
                                        {material.reservation_price}
                                    </p>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">
                                    DA{" "}
                                    {material.reservation_price * data.quantity}
                                </span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-8">
                        <div className="flex gap-3 w-full justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="h-12 px-6 rounded-lg border-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-12 px-8 rounded-lg  text-white shadow-sm transition-colors"
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Confirm Reservation"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReserveModal;
