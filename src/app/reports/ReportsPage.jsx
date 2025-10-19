"use client";

import { useState, useMemo } from 'react';
import Table from '@/components/Table';
import Section from '@/components/Section';
import ModalReportView from "@/components/ModalReportView";
import { Trash, Search } from 'lucide-react';

export default function ReportsPage({ reports }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reports based on search term
  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;
    
    return reports.filter(report => 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.create_date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  const columns = [
    { 
      header: 'Name',
      key: 'name',
      render: (v) => {
        return <h4 className="font-semibold text-black">{v}</h4>
      }
    },
    { 
      header: 'Report', 
      key: 'report',
      render: (v) => {
        return `${ JSON.parse(v).length } checklist`;
      }
    },
    { 
      header: 'Create Date', 
      key: 'create_date', 
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      header: '_',
      render: (v, row) => {
        return <div className="flex items-center gap-3">
          <ModalReportView reportItem={row} />
        </div>
      }
    }
  ];

  const DeleteAllReports = async () => {
    const r = confirm('Are you sure you want to delete all reports?');
    if (!r) return;

    try {
      await fetch('/api/report/delete-all', {
        method: 'DELETE',
      });

      window.location.reload();
    }
    catch (error) {
      console.error('Error deleting all reports:', error);
    }
  }

  return (
    <Section>
      <div className="pb-8 mb-8 border-b flex items-center justify-between">
        <h2 className="font-bold">Resports Table</h2>
        <button className="flex items-center gap-2 text-red-400 border px-4 py-2 cursor-pointer hover:opacity-70 font-mono text-sm" onClick={ DeleteAllReports }>
          <Trash className="w-4 h-4" />
          <span>Delete all report(s)</span>
        </button>
      </div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports (by Name or Create Date	)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border-b border-gray-300 bg-gray-50 leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-500">
            {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>
      <Table data={filteredReports} columns={columns} />
    </Section>
  )
}