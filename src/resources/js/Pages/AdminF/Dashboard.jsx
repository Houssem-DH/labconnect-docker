import { useContext } from "react";
import { LanguageContext } from "@/lib/LanguageContext";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";

export default function Dashboard({ auth }) {
  const { language } = useContext(LanguageContext);

  // Mock data
  const stats = {
    totalLabs: 24,
    activeLabs: 18,
    maintenanceLabs: 4,
    avgCapacity: 82,
  };

  const recentLabs = [
    { id: 1, name: "Bio Lab 1", status: "active", capacity: "24/30", updated: "2h ago" },
    { id: 2, name: "Chem Lab A", status: "maintenance", capacity: "0/40", updated: "5h ago" },
    { id: 3, name: "Physics Lab X", status: "inactive", capacity: "12/20", updated: "1d ago" },
  ];

  return (
    <AdminLayout user={auth.user}>
      {language === "en" ? (
        <Head title="Dashboard" />
      ) : language === "ar" ? (
        <Head title="لوحة القيادة" />
      ) : (
        <Head title="tableau de bord" />
      )}
      
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {language === "en" ? "Dashboard" : 
             language === "ar" ? "لوحة إدارة المختبرات" : 
             "Tableau de bord de gestion de laboratoire"}
          </h1>
          <p className="text-gray-600">
            {language === "en" ? "Last updated: 1 hour ago" : 
             language === "ar" ? "آخر تحديث: منذ ساعة" : 
             "Dernière mise à jour: il y a 1 heure"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Total Labs" : 
                 language === "ar" ? "إجمالي المختبرات" : 
                 "Laboratoires totaux"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.totalLabs}</p>
              <span className="text-green-500 text-sm">↑ 12%</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Active Labs" : 
                 language === "ar" ? "المختبرات النشطة" : 
                 "Laboratoires actifs"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.activeLabs}</p>
              <span className="text-gray-500 text-sm">75% utilization</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Maintenance" : 
                 language === "ar" ? "الصيانة" : 
                 "Maintenance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats.maintenanceLabs}</p>
              <span className="text-gray-500 text-sm">2 critical issues</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {language === "en" ? "Avg. Capacity" : 
                 language === "ar" ? "متوسط السعة" : 
                 "Capacité moyenne"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{stats.avgCapacity}%</p>
              <span className="text-gray-500 text-sm">Optimal range</span>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Area */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Lab Usage Overview" : 
                 language === "ar" ? "نظرة عامة على الاستخدام" : 
                 "Aperçu de l'utilisation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Recent Lab Activities" : 
                 language === "ar" ? "الأنشطة الحديثة" : 
                 "Activités récentes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "en" ? "Lab Name" : "اسم المختبر"}</TableHead>
                    <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead>{language === "en" ? "Capacity" : "السعة"}</TableHead>
                    <TableHead className="text-right">{language === "en" ? "Last Updated" : "آخر تحديث"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLabs.map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell className="font-medium">{lab.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            lab.status === 'active' ? 'bg-green-100 text-green-800' :
                            lab.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {lab.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lab.capacity}</TableCell>
                      <TableCell className="text-right">{lab.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
}