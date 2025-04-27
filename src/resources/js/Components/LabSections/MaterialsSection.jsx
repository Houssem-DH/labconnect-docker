import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaInfoCircle,
  FaLink,
  FaBox,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import ReserveModal from "@/Components/LabSections/Partials/ReserveMaterial"; // Import the new modal component

const MaterialsSection = ({ materials }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  const handleReserveClick = (material) => {
    setSelectedMaterial(material);
    setIsReserveModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
          >
            {/* Card content remains the same */}
            <div className="relative">
              <img
                src={`storage/${material.picture}`}
                alt={material.name}
                className="w-full h-48 object-cover"
              />
              <Badge 
                variant={material.availability ? "default" : "destructive"} 
                className="absolute top-2 right-2"
              >
                {material.availability ? "Available" : "Unavailable"}
              </Badge>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {material.name}
                </h3>
                <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
                  {material.reservation_type}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <FaInfoCircle className="text-main mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    {material.use_case || "Use case not specified"}
                  </p>
                </div>

                <div className="flex items-start">
                  <FaLink className="text-main mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    {material.reference || "No reference"}
                  </p>
                </div>

                <div className="flex items-start">
                  <FaMoneyBillWave className="text-main mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    {material.reservation_price ? `DA ${material.reservation_price}` : "Price not set"}
                  </p>
                </div>

                <div className="flex items-start">
                  <FaBox className="text-main mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 line-clamp-2">
                    {material.description || "No description provided"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Badge variant="outline" className="text-sm">
                  Updated: {new Date(material.updated_at).toLocaleDateString()}
                </Badge>
                
                <Button 
                  size="sm"
                  onClick={() => handleReserveClick(material)}
                  disabled={!material.availability}
                >
                  Reserve
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Use the new ReserveModal component */}
      {selectedMaterial && (
        <ReserveModal
          material={selectedMaterial}
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
        />
      )}
    </>
  );
};

export default MaterialsSection;