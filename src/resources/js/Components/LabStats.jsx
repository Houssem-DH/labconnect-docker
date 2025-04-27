import { Card, CardContent, CardTitle } from "@/Components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, UserCheck, UserPlus, UserX, UserMinus, Wrench } from "lucide-react";

// Pie chart colors
const COLORS = ["#0088FE", "#FF8042"];

export default function LabStats({
  number_teams,
  number_lab_members,
  number_researchers,
  researchers_establishment,
  researchers_out_establishment,
  number_support_stuff,
}) {
  // Pie chart data
  const data = [
    { name: "In Lab", value: researchers_establishment },
    { name: "Out of Lab", value: researchers_out_establishment },
  ];

  return (
    <div className="py-6">
      <Card className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Card Header */}
          <div className="flex items-center justify-between py-4 px-8 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Lab Stats
            </CardTitle>
          </div>

          {/* Card Content */}
          <CardContent className="text-gray-700 p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Teams */}
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                <Users className="text-main h-8 w-8 mb-2" />
                <span className="text-xl font-semibold">Total Teams</span>
                <span className="text-sm text-gray-500">{number_teams}</span>
              </div>

              {/* Total Lab Members */}
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                <UserCheck className="text-main h-8 w-8 mb-2" />
                <span className="text-xl font-semibold">Total Lab Members</span>
                <span className="text-sm text-gray-500">{number_lab_members}</span>
              </div>

              {/* Researchers */}
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                <UserPlus className="text-main h-8 w-8 mb-2" />
                <span className="text-xl font-semibold">Researchers</span>
                <span className="text-sm text-gray-500">{number_researchers}</span>
              </div>

              {/* Researchers in Establishment */}
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                <UserX className="text-main h-8 w-8 mb-2" />
                <span className="text-xl font-semibold">Researchers in Establishment</span>
                <span className="text-sm text-gray-500">{researchers_establishment}</span>
              </div>

              {/* Researchers Out of Establishment */}
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                <UserMinus className="text-main h-8 w-8 mb-2" />
                <span className="text-xl font-semibold">Researchers Out of Establishment</span>
                <span className="text-sm text-gray-500">{researchers_out_establishment}</span>
              </div>

              {/* Support Staff */}
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                <Wrench className="text-main h-8 w-8 mb-2" />
                <span className="text-xl font-semibold">Support Staff</span>
                <span className="text-sm text-gray-500">{number_support_stuff}</span>
              </div>
            </div>

            {/* Researcher Status Pie Chart */}
            <div className="flex flex-col items-center mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
              <span className="text-xl font-semibold mb-4">Researcher Status</span>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
