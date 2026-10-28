// Professional Vehicle Inspection PDF Report Generator
// Matches the visual hierarchy, scorecard, checklist layout, and certification
// of the reference 22-page PDI report (PDI-000028) with Z9 Automotive branding.

import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Inspection, CategorySummary } from '../../types';
import { CHECKLIST_CATEGORIES } from '../../data/checklistDefinition';
import { calculateInspectionMetrics } from '../../utils/inspectionCalculations';

export async function generateAndShareInspectionPdf(
  inspection: Inspection,
  mode: 'share' | 'print' = 'share'
): Promise<string> {
  const htmlContent = buildReportHtml(inspection);

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
      }
    }
    return 'web-preview-opened';
  }

  const { uri } = await Print.printToFileAsync({
    html: htmlContent,
    base64: false,
  });

  if (mode === 'share') {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Z9 Automotive Inspection Report - ${inspection.reportId}`,
      });
    }
  } else {
    await Print.printAsync({ uri });
  }

  return uri;
}

function buildReportHtml(inspection: Inspection): string {
  const metrics = calculateInspectionMetrics(inspection.results);
  const results = inspection.results || {};
  const photos = inspection.photos || [];

  const customerName = inspection.customer?.name || 'Customer';
  const customerPhone = inspection.customer?.phone || 'N/A';
  const customerCity = inspection.customer?.city || 'India';

  const vehicle = inspection.vehicle;
  const make = vehicle?.make || 'VEHICLE';
  const model = vehicle?.model || '';
  const vin = vehicle?.vin || 'N/A';
  const engine = vehicle?.fuelType ? `${vehicle.fuelType.toUpperCase()}` : 'PETROL';
  const odometer = inspection.odometer || vehicle?.odometer || 0;
  const fuelLevel = inspection.fuelLevel || vehicle?.fuelLevel || 'N/A';
  const dealer = inspection.dealerSource || 'Authorized Service Center';

  const dateStr = new Date(inspection.inspectionDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Category badges grid
  const categoryTilesHtml = metrics.categorySummaries
    .map((cat) => {
      const isScored = cat.passed + cat.failed > 0;
      const pctDisplay = isScored ? `${cat.passPercentage}%` : '—';
      const countDisplay = `${cat.passed} / ${cat.total} passed`;
      const badgeColor = isScored
        ? cat.passPercentage === 100
          ? '#16a34a'
          : '#ea580c'
        : '#94a3b8';

      return `
      <div class="cat-tile">
        <div class="cat-code">${cat.shortLabel}</div>
        <div class="cat-pct" style="color: ${badgeColor};">${pctDisplay}</div>
        <div class="cat-name">${cat.name.toUpperCase()}</div>
        <div class="cat-counts">${countDisplay}</div>
      </div>
    `;
    })
    .join('');

  // Detailed checklist categories HTML
  const checklistSectionsHtml = CHECKLIST_CATEGORIES.map((cat) => {
    const subSectionsHtml = cat.subsections
      .map((sub) => {
        const rowsHtml = sub.items
          .map((item) => {
            const itemRes = results[item.id];
            const status = itemRes?.status || 'PENDING';
            const remark = itemRes?.remarks || item.referenceValue || '';

            let badgeClass = 'badge-pending';
            if (status === 'PASS') badgeClass = 'badge-pass';
            if (status === 'FAIL') badgeClass = 'badge-fail';

            const remarkHtml = remark
              ? `<div class="item-remark">Note: ${escapeHtml(remark)}</div>`
              : '';

            return `
            <div class="table-row">
              <div class="item-cell">
                <div class="item-title">${escapeHtml(item.name)}</div>
                ${remarkHtml}
              </div>
              <div class="status-cell">
                <span class="badge ${badgeClass}">${status}</span>
              </div>
            </div>
          `;
          })
          .join('');

        return `
        <div class="subsection-block">
          <div class="subsection-title">${escapeHtml(sub.name)}</div>
          <div class="checklist-table">
            ${rowsHtml}
          </div>
        </div>
      `;
      })
      .join('');

    return `
      <div class="category-block page-break">
        <div class="cat-header">
          <div class="cat-header-brand">Z9 AUTOMOTIVE • ${cat.code}</div>
          <div class="cat-header-title">${cat.name}</div>
        </div>
        ${subSectionsHtml}
      </div>
    `;
  }).join('');

  // Photo gallery HTML
  const photosHtml =
    photos.length > 0
      ? `
    <div class="category-block page-break">
      <div class="cat-header">
        <div class="cat-header-brand">Z9 AUTOMOTIVE • EVIDENCE</div>
        <div class="cat-header-title">Photographic Inspection Evidence</div>
      </div>
      <div class="photo-grid">
        ${photos
          .map(
            (p) => `
          <div class="photo-card">
            ${
              p.localUri
                ? `<img src="${p.localUri}" class="photo-img" />`
                : `<div class="photo-placeholder">Evidence Photo (${p.photoType})</div>`
            }
            <div class="photo-caption">${escapeHtml(p.caption || p.photoType)}</div>
            <div class="photo-time">${new Date(p.createdAt).toLocaleTimeString()}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
      : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Z9 Automotive Vehicle Inspection Report - ${inspection.reportId}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm 18mm 15mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          margin: 0;
          padding: 0;
          font-size: 11pt;
          line-height: 1.4;
        }
        .page-break {
          page-break-before: always;
        }
        
        /* HEADER COVER */
        .cover-header {
          border-bottom: 3px solid #FFB800;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand-title {
          font-size: 22pt;
          font-weight: 800;
          color: #FFB800;
          letter-spacing: -0.5px;
        }
        .brand-subtitle {
          font-size: 8.5pt;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .report-badge {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 10pt;
          font-weight: 700;
          color: #0f172a;
        }
        
        /* VEHICLE BANNER */
        .vehicle-banner {
          background: #0f172a;
          color: #ffffff;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .vehicle-make {
          font-size: 10pt;
          font-weight: 600;
          color: #FFB800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .vehicle-name {
          font-size: 20pt;
          font-weight: 800;
          margin: 2px 0 6px 0;
        }
        .vehicle-desc {
          font-size: 9.5pt;
          color: #94a3b8;
        }

        /* METADATA GRID */
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .meta-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
        }
        .meta-label {
          font-size: 7.5pt;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .meta-value {
          font-size: 10pt;
          font-weight: 700;
          color: #0f172a;
        }
        .meta-sub {
          font-size: 8pt;
          color: #64748b;
          margin-top: 2px;
        }

        /* OVERALL SCORECARD */
        .score-card {
          background: #fff7ed;
          border: 1.5px solid #fed7aa;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .score-main {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .score-number {
          font-size: 32pt;
          font-weight: 900;
          color: ${metrics.passPercentage >= 90 ? '#16a34a' : '#ea580c'};
        }
        .score-details-title {
          font-size: 12pt;
          font-weight: 700;
          color: #0f172a;
        }
        .score-details-sub {
          font-size: 9pt;
          color: #64748b;
        }
        .score-counts {
          text-align: right;
          font-size: 9.5pt;
          font-weight: 600;
        }
        .score-pass { color: #16a34a; }
        .score-fail { color: #dc2626; }
        .score-pending { color: #d97706; }

        /* CATEGORY TILES */
        .category-tiles-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        .cat-tile {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
        }
        .cat-code {
          font-size: 7.5pt;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.5px;
        }
        .cat-pct {
          font-size: 18pt;
          font-weight: 800;
          margin: 2px 0;
        }
        .cat-name {
          font-size: 7.5pt;
          font-weight: 700;
          color: #334155;
          margin-bottom: 2px;
        }
        .cat-counts {
          font-size: 7pt;
          color: #64748b;
        }

        /* CHECKLIST SECTIONS */
        .category-block {
          margin-bottom: 20px;
        }
        .cat-header {
          border-bottom: 2px solid #0f172a;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }
        .cat-header-brand {
          font-size: 7.5pt;
          font-weight: 700;
          color: #D97706;
          letter-spacing: 1px;
        }
        .cat-header-title {
          font-size: 15pt;
          font-weight: 800;
          color: #0f172a;
        }
        .subsection-block {
          margin-bottom: 14px;
        }
        .subsection-title {
          font-size: 10.5pt;
          font-weight: 700;
          color: #1e293b;
          background: #f1f5f9;
          padding: 5px 8px;
          border-left: 3px solid #FFB800;
          margin-bottom: 6px;
        }
        .checklist-table {
          display: flex;
          flex-direction: column;
        }
        .table-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 6px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 8.5pt;
        }
        .table-row:nth-child(even) {
          background: #fafafa;
        }
        .item-cell {
          flex: 1;
          padding-right: 12px;
        }
        .item-title {
          color: #1e293b;
          font-weight: 500;
        }
        .item-remark {
          font-size: 7.5pt;
          color: #dc2626;
          font-weight: 600;
          margin-top: 2px;
        }
        .status-cell {
          width: 70px;
          text-align: right;
        }
        .badge {
          display: inline-block;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 7pt;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .badge-pass {
          background: #dcfce7;
          color: #166534;
        }
        .badge-fail {
          background: #fee2e2;
          color: #991b1b;
        }
        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }

        /* EVIDENCE PHOTOS */
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 12px;
        }
        .photo-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px;
          background: #f8fafc;
          text-align: center;
        }
        .photo-img {
          width: 100%;
          height: 130px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .photo-placeholder {
          height: 130px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 8pt;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .photo-caption {
          font-size: 8pt;
          font-weight: 600;
          color: #0f172a;
        }
        .photo-time {
          font-size: 7pt;
          color: #64748b;
        }

        /* CERTIFICATION PAGE */
        .cert-card {
          border: 2px solid #0f172a;
          border-radius: 12px;
          padding: 30px;
          margin-top: 40px;
          background: #ffffff;
          position: relative;
        }
        .cert-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .cert-tag {
          font-size: 9pt;
          font-weight: 800;
          color: #FFB800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .cert-title {
          font-size: 20pt;
          font-weight: 900;
          color: #0f172a;
          margin: 6px 0;
        }
        .cert-sub {
          font-size: 10pt;
          color: #64748b;
        }
        .cert-body {
          font-size: 10pt;
          line-height: 1.7;
          color: #334155;
          margin-bottom: 28px;
          text-align: justify;
        }
        .cert-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 28px;
        }
        .cert-detail-item strong {
          display: block;
          font-size: 8pt;
          color: #64748b;
          text-transform: uppercase;
        }
        .cert-detail-item span {
          font-size: 11pt;
          font-weight: 700;
          color: #0f172a;
        }
        .cert-footer-text {
          font-size: 8pt;
          color: #64748b;
          line-height: 1.5;
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
          text-align: center;
        }
      </style>
    </head>
    <body>

      <!-- PAGE 1: COVER & EXECUTIVE SUMMARY -->
      <div class="cover-header">
        <div>
          <div class="brand-title">Z9 AUTOMOTIVE</div>
          <div class="brand-subtitle">VEHICLE INSPECTION REPORT • CONFIDENTIAL</div>
        </div>
        <div class="report-badge">Report ID: ${inspection.reportId}</div>
      </div>

      <div class="vehicle-banner">
        <div class="vehicle-make">${escapeHtml(make)}</div>
        <div class="vehicle-name">${escapeHtml(model || make)}</div>
        <div class="vehicle-desc">Comprehensive Multi-Point Vehicle Condition Assessment & PDI Analysis</div>
      </div>

      <!-- CLIENT & VEHICLE GRID -->
      <div class="meta-grid">
        <div class="meta-card">
          <div class="meta-label">Client Information</div>
          <div class="meta-value">${escapeHtml(customerName)}</div>
          <div class="meta-sub">${escapeHtml(customerPhone)}</div>
          <div class="meta-sub">${escapeHtml(customerCity)}</div>
        </div>

        <div class="meta-card">
          <div class="meta-label">Vehicle Details</div>
          <div class="meta-value">${escapeHtml(vehicle?.registrationNumber || 'NEW REG')}</div>
          <div class="meta-sub">VIN: ${escapeHtml(vin)}</div>
          <div class="meta-sub">Engine: ${escapeHtml(engine)}</div>
        </div>

        <div class="meta-card">
          <div class="meta-label">Inspection Data</div>
          <div class="meta-value">${dateStr}</div>
          <div class="meta-sub">Odometer: ${odometer} km</div>
          <div class="meta-sub">Fuel Level: ${fuelLevel}</div>
        </div>

        <div class="meta-card">
          <div class="meta-label">Dealer & Inspector</div>
          <div class="meta-value">${escapeHtml(dealer)}</div>
          <div class="meta-sub">Inspector: ${escapeHtml(inspection.inspectorName)}</div>
          <div class="meta-sub">Status: ${inspection.status.toUpperCase()}</div>
        </div>
      </div>

      <!-- OVERALL SCORECARD -->
      <div class="score-card">
        <div class="score-main">
          <div class="score-number">${metrics.passPercentage}%</div>
          <div>
            <div class="score-details-title">Systematic Quality Assessment</div>
            <div class="score-details-sub">${metrics.passedItems} of ${metrics.scoredItems} scored items passed</div>
          </div>
        </div>
        <div class="score-counts">
          <div class="score-pass">✓ ${metrics.passedItems} Passed</div>
          <div class="score-fail">✗ ${metrics.failedItems} Failed</div>
          <div class="score-pending">⏳ ${metrics.pendingItems} Pending</div>
        </div>
      </div>

      <!-- CATEGORY TILES GRID -->
      <div class="category-tiles-container">
        ${categoryTilesHtml}
      </div>

      <!-- DETAILED CHECKLIST ITEMS -->
      ${checklistSectionsHtml}

      <!-- PHOTOGRAPHIC EVIDENCE -->
      ${photosHtml}

      <!-- PAGE 22: CERTIFICATE OF INSPECTION -->
      <div class="page-break">
        <div class="cert-card">
          <div class="cert-header">
            <div class="cert-tag">CERTIFICATION OF INSPECTION</div>
            <div class="cert-title">Official Verification Document</div>
            <div class="cert-sub">Z9 Automotive Quality Assurance</div>
          </div>

          <div class="cert-body">
            This document certifies that a comprehensive vehicle inspection was conducted on the <strong>${escapeHtml(make)} ${escapeHtml(model)}</strong> (VIN: ${escapeHtml(vin)}) on ${dateStr}. All findings documented in this report reflect the vehicle condition at the time of inspection, verified by certified automotive inspection professionals using industry-standard workshop procedures and diagnostic checklists.
            <br/><br/>
            This certificate is issued for the exclusive use of <strong>${escapeHtml(customerName)}</strong> and may be presented to authorized dealers, service centers, insurance underwriters, or financial institutions as validation of vehicle inspection completion.
          </div>

          <div class="cert-details-grid">
            <div class="cert-detail-item">
              <strong>Report Identifier</strong>
              <span>${inspection.reportId}</span>
            </div>
            <div class="cert-detail-item">
              <strong>Vehicle Identity</strong>
              <span>${escapeHtml(make)} ${escapeHtml(model)} | ${escapeHtml(vin)}</span>
            </div>
            <div class="cert-detail-item">
              <strong>Certified Inspector</strong>
              <span>${escapeHtml(inspection.inspectorName)}</span>
            </div>
            <div class="cert-detail-item">
              <strong>Issued On</strong>
              <span>${dateStr}</span>
            </div>
          </div>

          <div class="cert-footer-text">
            This document is a digitally generated copy of the Z9 Automotive vehicle inspection report. It is issued electronically and does not require a handwritten signature to be considered valid. Findings reflect the vehicle condition at the time of inspection and remain on file with Z9 Automotive.
            <br/>
            <strong>Z9 Automotive • Comprehensive Inspection & Quality Assurance</strong>
          </div>
        </div>
      </div>

    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
