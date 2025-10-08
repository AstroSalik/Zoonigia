/**
 * Export utility functions for admin data management
 */

/**
 * Convert array of objects to CSV format
 */
export function jsonToCSV(data: any[], columns?: string[]): string {
  if (data.length === 0) return '';

  // Get headers from columns array or first object keys
  const headers = columns || Object.keys(data[0]);
  
  // Create CSV header row
  const csvHeader = headers.join(',');
  
  // Create CSV data rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      let cell = row[header];
      
      // Handle null/undefined
      if (cell === null || cell === undefined) {
        return '';
      }
      
      // Handle dates
      if (cell instanceof Date) {
        cell = cell.toISOString();
      }
      
      // Handle objects/arrays
      if (typeof cell === 'object') {
        cell = JSON.stringify(cell);
      }
      
      // Convert to string and escape quotes
      cell = cell.toString().replace(/"/g, '""');
      
      // Wrap in quotes if contains comma, newline, or quote
      if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
        return `"${cell}"`;
      }
      
      return cell;
    }).join(',');
  });
  
  return [csvHeader, ...csvRows].join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: any[], filename: string, columns?: string[]): void {
  const csv = jsonToCSV(data, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format data for export by removing sensitive fields
 */
export function sanitizeForExport(data: any[], sensitiveFields: string[] = []): any[] {
  const defaultSensitiveFields = ['password', 'token', 'secret', 'key', 'apiKey'];
  const fieldsToRemove = [...defaultSensitiveFields, ...sensitiveFields];
  
  return data.map(item => {
    const sanitized = { ...item };
    fieldsToRemove.forEach(field => {
      if (field in sanitized) {
        delete sanitized[field];
      }
    });
    return sanitized;
  });
}

/**
 * Export users data
 */
export function exportUsers(users: any[]): void {
  const sanitized = sanitizeForExport(users, ['firebaseUid']);
  const columns = ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'createdAt'];
  downloadCSV(sanitized, 'zoonigia-users', columns);
}

/**
 * Export courses data
 */
export function exportCourses(courses: any[]): void {
  const columns = ['id', 'title', 'status', 'enrollmentCount', 'price', 'level', 'instructorName', 'createdAt'];
  downloadCSV(courses, 'zoonigia-courses', columns);
}

/**
 * Export inquiries data
 */
export function exportInquiries(inquiries: any[]): void {
  const columns = ['id', 'name', 'email', 'message', 'inquiryType', 'createdAt'];
  downloadCSV(inquiries, 'zoonigia-inquiries', columns);
}

/**
 * Export workshops data
 */
export function exportWorkshops(workshops: any[]): void {
  const columns = ['id', 'title', 'type', 'startDate', 'endDate', 'location', 'maxParticipants', 'price', 'createdAt'];
  downloadCSV(workshops, 'zoonigia-workshops', columns);
}

/**
 * Export campaigns data
 */
export function exportCampaigns(campaigns: any[]): void {
  const columns = ['id', 'title', 'type', 'status', 'startDate', 'endDate', 'maxParticipants', 'price', 'createdAt'];
  downloadCSV(campaigns, 'zoonigia-campaigns', columns);
}

