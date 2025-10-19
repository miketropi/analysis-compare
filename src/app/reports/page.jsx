import { dbHelper } from '@/lib/dbHelper.js';
import ReportsPage from './ReportsPage';

export const metadata = {
  title: "Analysis Compare - Reports",
  description: "Simple, powerful data comparison and analysis",
};

const getReports = async () => {
  const reports = await dbHelper.all('SELECT * FROM reports ORDER BY id DESC');
  return reports;
};

export default async function Reports() {
  const reports = await getReports();

  return <>
    <ReportsPage reports={ reports } />
  </>;
};