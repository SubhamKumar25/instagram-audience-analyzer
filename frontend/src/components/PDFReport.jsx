import React from 'react';
import { FileDown } from 'lucide-react';

export default function PDFReport({ username }) {
  const triggerPrint = () => {
    // Add temporary print title
    const originalTitle = document.title;
    document.title = `Audience_Report_@${username || 'instagram'}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <>
      {/* Dynamic Style Injection for premium print margins */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          /* Hide non-report layout utilities */
          nav, footer, .no-print, button, form, .glass-input {
            display: none !important;
          }
          /* Format cards to look crisp on white paper */
          .glass-panel {
            background: white !important;
            border: 1px solid #E2E8F0 !important;
            box-shadow: none !important;
            color: black !important;
            page-break-inside: avoid;
            margin-bottom: 20px !important;
          }
          h1, h2, h3, h4, span, p, div {
            color: black !important;
          }
          /* Ensure charts are visible and centered */
          .recharts-responsive-container {
            width: 100% !important;
            height: 250px !important;
          }
        }
      `}</style>
      <button
        onClick={triggerPrint}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl glass-button text-xs font-bold text-white cursor-pointer select-none"
      >
        <FileDown className="w-4 h-4 text-purple-400" />
        <span>Download PDF Report</span>
      </button>
    </>
  );
}
