import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to load image as base64
async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const BRAND_COLOR = [156, 114, 85]; // Coffee brown from logo #9c7255

// ---------------------------------------------------------
// 1. Institutional Progress Report
// ---------------------------------------------------------
export async function generateInstitutionalProgressReport(batch: any, students: any[]) {
  const doc = new jsPDF('p', 'pt', 'a4');
  
  try {
    const logoBase64 = await getBase64ImageFromUrl('/tcb-logo.png');
    doc.addImage(logoBase64, 'PNG', 40, 30, 60, 60);
  } catch (e) {
    console.error("Could not load logo", e);
  }

  doc.setFontSize(22);
  doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.text("Institutional Progress Report", 110, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  const institutionName = batch.name.replace(/\s*\(\d+-Days?\)/i, '').trim();
  doc.text(`Institution: ${institutionName}`, 110, 75);
  doc.text(`Workshop: ${batch.workshopDays}-Days Soft Skills & Employability Workshop`, 110, 90);
  
  const completedCount = students.filter(s => s.status === 'APPROVED' && s.progress === 100).length;
  doc.text(`Total Enrolled: ${students.length} | Completed: ${completedCount}`, 110, 105);

  doc.setFontSize(10);
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 40, 140);

  const tableData = students.map((s, index) => [
    index + 1,
    s.name,
    s.email,
    s.progress === 100 ? 'Completed' : (s.progress > 0 ? 'In Progress' : 'Not Started'),
    s.progress + '%'
  ]);

  autoTable(doc, {
    startY: 155,
    head: [['#', 'Student Name', 'Email', 'Status', 'Progress']],
    body: tableData,
    headStyles: { fillColor: BRAND_COLOR as [number, number, number] },
    alternateRowStyles: { fillColor: [245, 240, 235] },
  });

  doc.save(`${institutionName}_Progress_Report.pdf`);
}

// ---------------------------------------------------------
// 2. Individual Progress Report
// ---------------------------------------------------------
export async function generateIndividualProgressReport(student: any, batch: any) {
  const doc = new jsPDF('p', 'pt', 'a4');
  
  try {
    const logoBase64 = await getBase64ImageFromUrl('/tcb-logo.png');
    doc.addImage(logoBase64, 'PNG', 40, 30, 60, 60);
  } catch (e) {
    console.error("Could not load logo", e);
  }

  doc.setFontSize(22);
  doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.text("Individual Progress Report", 110, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`Student Name: ${student.name}`, 110, 75);
  doc.text(`Email: ${student.email}`, 110, 90);
  
  const institutionName = batch.name.replace(/\s*\(\d+-Days?\)/i, '').trim();
  doc.text(`Institution / Batch: ${institutionName}`, 110, 105);

  doc.setFontSize(10);
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 40, 140);
  doc.text(`Overall Progress: ${student.progress || 0}%`, 40, 155);

  const submissions = student.submissions || {};
  const tableData = Object.keys(submissions).map((dayKey) => {
    const day = dayKey.replace('day_', '');
    const sub = submissions[dayKey];
    return [`Day ${day}`, 'Completed', new Date(sub.submittedAt).toLocaleDateString(), sub.filename || "Uploaded"];
  });

  if (tableData.length === 0) {
    doc.text("No submissions recorded yet.", 40, 180);
  } else {
    autoTable(doc, {
      startY: 170,
      head: [['Module', 'Status', 'Submitted On', 'File']],
      body: tableData,
      headStyles: { fillColor: BRAND_COLOR as [number, number, number] },
      alternateRowStyles: { fillColor: [245, 240, 235] },
    });
  }

  doc.save(`${student.name}_Progress_Report.pdf`);
}

// ---------------------------------------------------------
// Helper for Certificate Borders and Layout
// ---------------------------------------------------------
async function drawCertificateLayout(doc: jsPDF, title: string, logoBase64: string | null, isInstitutional: boolean) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  
  // Outer Border
  doc.setDrawColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.setLineWidth(4);
  doc.rect(20, 20, width - 40, height - 40);
  
  // Inner Border
  doc.setLineWidth(1);
  doc.rect(26, 26, width - 52, height - 52);

  // Background tint (very light brew)
  doc.setFillColor(252, 250, 248);
  doc.rect(27, 27, width - 54, height - 54, "F");

  // Logo (Left for TCB, Right for Institution placeholder if institutional)
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 40, 40, 80, 80);
  }

  if (isInstitutional) {
    // Placeholder for Institution Logo on top right
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([5, 5], 0);
    doc.rect(width - 120, 40, 80, 80);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text("Inst. Logo", width - 105, 85);
    doc.setLineDashPattern([], 0); // reset
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.setFontSize(36);
  doc.text(title, width / 2, 120, { align: 'center' });
  
  // Decorative line
  doc.setDrawColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.setLineWidth(1.5);
  doc.line(width / 2 - 150, 135, width / 2 + 150, 135);
}

// ---------------------------------------------------------
// 3. Institutional Certificate
// ---------------------------------------------------------
export async function generateInstitutionalCertificate(batch: any) {
  const doc = new jsPDF('l', 'pt', 'a4'); // Landscape
  const width = doc.internal.pageSize.getWidth();
  
  let logoBase64 = null;
  try { logoBase64 = await getBase64ImageFromUrl('/tcb-logo.png'); } catch (e) { console.error(e); }

  await drawCertificateLayout(doc, "CERTIFICATE OF APPRECIATION", logoBase64, true);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(16);
  doc.text("Proudly presented to", width / 2, 220, { align: 'center' });

  // Institution Name
  const institutionName = batch.name.replace(/\s*\(\d+-Days?\)/i, '').trim();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.text(institutionName, width / 2, 270, { align: 'center' });

  // Body
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(16);
  const text = `for their outstanding commitment to student development by successfully\norganizing and hosting the ${batch.workshopDays}-Days Soft Skills & Employability Workshop.`;
  doc.text(text, width / 2, 330, { align: 'center', lineHeightFactor: 1.5 });

  // Date
  doc.setFontSize(12);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, width / 2, 400, { align: 'center' });

  // Signatures
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(1);
  
  // Left Signature
  doc.line(150, 480, 300, 480);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("S D Sandarsh", 225, 500, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Lead Trainer / CEO\nThe Career Breweries", 225, 515, { align: 'center' });

  // Right Signature
  doc.line(width - 300, 480, width - 150, 480);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", width - 225, 500, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Institution Head", width - 225, 515, { align: 'center' });

  doc.save(`${institutionName}_Certificate.pdf`);
}

// ---------------------------------------------------------
// 4. Individual Certificate (Single)
// ---------------------------------------------------------
async function renderStudentCertificatePage(doc: jsPDF, student: any, batch: any, logoBase64: string | null) {
  const width = doc.internal.pageSize.getWidth();
  
  await drawCertificateLayout(doc, "CERTIFICATE OF COMPLETION", logoBase64, false);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(16);
  doc.text("This certifies that", width / 2, 200, { align: 'center' });

  // Student Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.text(student.name.toUpperCase(), width / 2, 250, { align: 'center' });

  // Sub text
  const institutionName = batch.name.startsWith('Master:') ? '' : batch.name.replace(/\s*\(\d+-Days?\)/i, '').trim();
  if (institutionName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text(`from ${institutionName}`, width / 2, 280, { align: 'center' });
  }

  // Body
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(16);
  const text = `has successfully completed the rigorous ${batch.workshopDays}-Days Soft Skills & Employability Workshop\ncovering Resume Building, LinkedIn Optimization, and Interview Readiness.`;
  doc.text(text, width / 2, 340, { align: 'center', lineHeightFactor: 1.5 });

  // Date and ID
  doc.setFontSize(12);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, width / 2 - 100, 420, { align: 'center' });
  // Random ID for official look
  const certId = `TCB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  doc.text(`Credential ID: ${certId}`, width / 2 + 100, 420, { align: 'center' });

  // Signatures
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(1);
  
  // Center Signature
  doc.line(width / 2 - 75, 490, width / 2 + 75, 490);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("S D Sandarsh", width / 2, 510, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Lead Trainer / CEO\nThe Career Breweries", width / 2, 525, { align: 'center' });
}

export async function generateIndividualCertificate(student: any, batch: any) {
  const doc = new jsPDF('l', 'pt', 'a4');
  let logoBase64 = null;
  try { logoBase64 = await getBase64ImageFromUrl('/tcb-logo.png'); } catch (e) { console.error(e); }

  await renderStudentCertificatePage(doc, student, batch, logoBase64);
  
  doc.save(`${student.name}_Certificate.pdf`);
}

// ---------------------------------------------------------
// 5. Bulk Batch Student Certificates
// ---------------------------------------------------------
export async function generateBatchStudentCertificates(batch: any, students: any[]) {
  const completedStudents = students.filter(s => s.status === 'APPROVED' && s.progress === 100);
  
  if (completedStudents.length === 0) {
    alert("No students have completed the workshop yet (100% progress required).");
    return;
  }

  const doc = new jsPDF('l', 'pt', 'a4');
  let logoBase64 = null;
  try { logoBase64 = await getBase64ImageFromUrl('/tcb-logo.png'); } catch (e) { console.error(e); }

  for (let i = 0; i < completedStudents.length; i++) {
    if (i > 0) doc.addPage();
    await renderStudentCertificatePage(doc, completedStudents[i], batch, logoBase64);
  }
  
  const institutionName = batch.name.replace(/\s*\(\d+-Days?\)/i, '').trim();
  doc.save(`${institutionName}_All_Student_Certificates.pdf`);
}
