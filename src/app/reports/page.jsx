import { dbHelper } from '@/lib/dbHelper.js';
import ReportsPage from './ReportsPage';

export const metadata = {
  title: "Analysis Compare - Reports",
  description: "Simple, powerful data comparison and analysis",
};

// const getReports = async () => {

//   try {
//     const reports = await dbHelper.all('SELECT * FROM reports ORDER BY id DESC');
//     return reports;
//   } catch (error) {
//     console.error('Failed to fetch reports:', error);
//     return [];
//   }
// };

export default async function Reports() {
  // const reports = await getReports();

  return <>
    <ReportsPage />
  </>;
};