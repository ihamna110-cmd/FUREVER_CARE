// ==========================================================================
// FurEver Care - Client-Side PDF Document Generator Engine
// Generates styled, printable official certificates and health passports
// ==========================================================================

window.PDFEngine = {
  generateHealthCardPDF: function(pet, vaccines, medical) {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert('Please allow popups in your browser to download the Health Card PDF.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>FurEver Care — Official Pet Health Passport (${pet.name})</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          @page { size: A4; margin: 15mm; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 24px;
            background: #ffffff;
          }
          .cert-box {
            border: 3px solid #0284c7;
            border-radius: 18px;
            padding: 30px;
            position: relative;
            background: radial-gradient(circle at top right, rgba(224, 242, 254, 0.4), transparent 70%);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #bae6fd;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #0284c7;
          }
          .badge {
            background: #0ea5e9;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 9999px;
            text-transform: uppercase;
          }
          .pet-hero {
            display: flex;
            gap: 24px;
            align-items: center;
            margin-bottom: 24px;
            background: #f0f9ff;
            padding: 18px;
            border-radius: 12px;
            border: 1px solid #bae6fd;
          }
          .pet-img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #0ea5e9;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            font-size: 13px;
          }
          .info-cell {
            background: #ffffff;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid #e0f2fe;
          }
          .info-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
          }
          .info-val {
            font-weight: 700;
            color: #0f172a;
            margin-top: 2px;
          }
          h3 {
            font-family: 'Outfit', sans-serif;
            color: #0369a1;
            margin: 20px 0 10px;
            font-size: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 18px;
          }
          th {
            background: #e0f2fe;
            color: #0369a1;
            padding: 8px 10px;
            text-align: left;
          }
          td {
            padding: 8px 10px;
            border-bottom: 1px solid #f1f5f9;
          }
          .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 1px dashed #94a3b8;
            padding-top: 16px;
            font-size: 11px;
            color: #64748b;
          }
          .sign-line {
            width: 180px;
            border-top: 1.5px solid #0f172a;
            text-align: center;
            padding-top: 4px;
            font-weight: 600;
          }
          .btn-print {
            background: #0284c7;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 20px;
          }
          @media print {
            .btn-print { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
        <div class="cert-box">
          <div class="header">
            <div>
              <div class="brand-title">FurEver Care 🐾</div>
              <div style="font-size: 12px; color: #64748b;">Official Certified Pet Health Passport</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">Verified Record</span>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Issued: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="pet-hero">
            <img src="${pet.photo}" alt="${pet.name}" class="pet-img" />
            <div style="flex: 1;">
              <h2 style="margin: 0 0 4px; font-size: 22px; color: #0284c7;">${pet.name}</h2>
              <div style="font-size: 13px; color: #475569;">${pet.species} • ${pet.breed} • ${pet.age}</div>
              <div style="font-size: 11px; color: #0ea5e9; font-weight: 700; margin-top: 4px;">Microchip: ${pet.microchip || '985-1410-0921-482'}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-cell">
              <div class="info-label">Recorded Weight</div>
              <div class="info-val">${pet.weight}</div>
            </div>
            <div class="info-cell">
              <div class="info-label">Immunity Status</div>
              <div class="info-val" style="color: #10b981;">✓ Up-to-Date</div>
            </div>
            <div class="info-cell">
              <div class="info-label">Known Allergies</div>
              <div class="info-val">${pet.allergies || 'None'}</div>
            </div>
          </div>

          <h3>Immunization & Vaccination Records</h3>
          <table>
            <thead>
              <tr>
                <th>Vaccine Name</th>
                <th>Administered</th>
                <th>Next Booster Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${vaccines.map(v => `
                <tr>
                  <td><strong>${v.name}</strong></td>
                  <td>${v.administeredDate}</td>
                  <td>${v.dueDate}</td>
                  <td style="color: #059669; font-weight: 700;">${v.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3>Recent Clinical Consultation History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Attending Veterinarian</th>
                <th>Diagnosis & Notes</th>
                <th>Medication</th>
              </tr>
            </thead>
            <tbody>
              ${medical.slice(0, 3).map(m => `
                <tr>
                  <td>${m.date}</td>
                  <td><strong>${m.vetName}</strong></td>
                  <td>${m.diagnosis}</td>
                  <td>${m.medications}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <div>FurEver Care National Veterinary Network</div>
              <div>Hospital License #VET-USA-992140</div>
            </div>
            <div class="sign-line">Authorized Veterinary Seal</div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  },

  generateVaccineCertPDF: function(pet, vaccines) {
    const printWindow = window.open('', '_blank', 'width=800,height=850');
    if (!printWindow) {
      alert('Please allow popups to download Vaccination Certificate PDF.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vaccination Certificate — ${pet.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 30px; color: #0f172a; }
          .cert-container { border: 4px double #0284c7; padding: 32px; border-radius: 12px; }
          .cert-header { text-align: center; border-bottom: 2px solid #bae6fd; padding-bottom: 16px; margin-bottom: 20px; }
          .title { font-family: 'Outfit', sans-serif; font-size: 26px; color: #0284c7; font-weight: 800; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th { background: #f0f9ff; color: #0369a1; padding: 10px; border: 1px solid #bae6fd; text-align: left; }
          td { padding: 10px; border: 1px solid #e2e8f0; }
          .btn-print { background: #0ea5e9; color: #fff; padding: 10px 22px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Print / Save Certificate PDF</button>
        <div class="cert-container">
          <div class="cert-header">
            <div class="title">OFFICIAL IMMUNIZATION CERTIFICATE</div>
            <div style="color: #64748b; font-size: 13px; margin-top: 4px;">FurEver Care Veterinary Network</div>
          </div>
          <p>This certifies that <strong>${pet.name}</strong> (${pet.species}, ${pet.breed}, Chip: ${pet.microchip || '985-1410-0921-482'}) has received the following official vaccinations:</p>
          <table>
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Administered Date</th>
                <th>Booster Due Date</th>
                <th>Clinic / Vet</th>
              </tr>
            </thead>
            <tbody>
              ${vaccines.map(v => `
                <tr>
                  <td><strong>${v.name}</strong></td>
                  <td>${v.administeredDate}</td>
                  <td style="color: #0284c7; font-weight: 700;">${v.dueDate}</td>
                  <td>${v.clinic} (${v.vet})</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <div>Date Issued: ${new Date().toLocaleDateString()}</div>
            <div style="border-top: 1px solid #000; width: 160px; text-align: center; padding-top: 4px;">Veterinary Signature</div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
