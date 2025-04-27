import { motion } from "framer-motion";
import LabLocationMap from "@/Components/LabLocation";

const LocationSection = ({ lab }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <div className="flex flex-col space-y-4">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-800">
                        Lab Location
                    </h2>

                    {/* Map */}
                    <div
                        className="relative w-full  rounded-lg overflow-hidden shadow-lg border border-gray-300 bg-gray-100"
                        style={{ zIndex: 1 }}
                    >
                        <LabLocationMap
                            lat={JSON.parse(lab.maps)[0]}
                            lng={JSON.parse(lab.maps)[1]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationSection;
