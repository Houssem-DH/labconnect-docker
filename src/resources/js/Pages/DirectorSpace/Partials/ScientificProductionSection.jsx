import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, SettingsIcon, TrashIcon } from "lucide-react";

const ScientificProductionSection = ({ scientificProductions, team }) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);

  return (
    <div className="p-4 md:p-8">
      <Card className="bg-gray-50 shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-600 text-white">
          <CardTitle className="text-xl font-semibold">Scientific Productions</CardTitle>
          <Button href={`/add-production/${team.id}`} className="bg-white text-blue-600 hover:bg-gray-100">
            <PlusIcon className="mr-2" /> Add Production
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {scientificProductions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {scientificProductions.map((production) => (
                <li key={production.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{production.title}</p>
                    <p className="text-sm text-gray-600">Type: {production.type}</p>
                    <p className="text-sm text-gray-600">Year: {production.year_publication}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={() => setExpandedIds(expandedIds.includes(production.id)
                      ? expandedIds.filter(id => id !== production.id)
                      : [...expandedIds, production.id])}>
                      {expandedIds.includes(production.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </Button>
                    <Button href={`/manage-production/${production.id}`}>
                      <SettingsIcon />
                    </Button>
                    <Button onClick={() => { setSelectedProduction(production); setIsDeleteModalOpen(true); }} variant="danger">
                      <TrashIcon />
                    </Button>
                  </div>
                  {expandedIds.includes(production.id) && (
                    <div className="mt-2 text-gray-600">
                      <p className="text-sm">URL: {production.url}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No scientific productions available</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Production Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this production? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <Button onClick={() => {/* Handle Delete */}} className="bg-red-600 text-white hover:bg-red-700">
            <TrashIcon className="mr-2" /> Delete
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScientificProductionSection;
