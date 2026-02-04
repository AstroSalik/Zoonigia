import { db } from "../db";
import { campaigns, courses, campaignTeamRegistrations, courseEnrollments, users } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { getUncachableGoogleSheetClient, handleGoogleSheetsError } from "../googleSheetClient";

interface ExportResult {
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  error?: string;
}

/**
 * Creates a new Google Sheet for a specific campaign
 */
export async function createCampaignGoogleSheet(campaignId: number): Promise<ExportResult> {
  try {
    console.log(`[Google Sheets] Creating new sheet for campaign ID: ${campaignId}`);
    
    // Get campaign details
    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);
    
    if (!campaign || campaign.length === 0) {
      return { success: false, error: "Campaign not found" };
    }
    
    const campaignData = campaign[0];
    
    // Get Google Sheets client
    const sheets = await getUncachableGoogleSheetClient();
    
    // Create a new spreadsheet for this campaign
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `${campaignData.title} - Registrations`,
        },
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId!;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    
    console.log(`[Google Sheets] Created spreadsheet for "${campaignData.title}": ${spreadsheetId}`);
    
    // Update campaign with Google Sheet info
    await db
      .update(campaigns)
      .set({
        googleSheetId: spreadsheetId,
        googleSheetUrl: spreadsheetUrl,
        updatedAt: new Date()
      })
      .where(eq(campaigns.id, campaignId));
    
    // Export current registrations to the new sheet
    await exportCampaignRegistrationsToSheet(campaignId, spreadsheetId, sheets);
    
    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl
    };
  } catch (error) {
    console.error(`[Google Sheets] Error creating sheet for campaign ${campaignId}:`, error);
    return { 
      success: false, 
      error: handleGoogleSheetsError(error)
    };
  }
}

/**
 * Creates a new Google Sheet for a specific course
 */
export async function createCourseGoogleSheet(courseId: number): Promise<ExportResult> {
  try {
    console.log(`[Google Sheets] Creating new sheet for course ID: ${courseId}`);
    
    // Get course details
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);
    
    if (!course || course.length === 0) {
      return { success: false, error: "Course not found" };
    }
    
    const courseData = course[0];
    
    // Get Google Sheets client
    const sheets = await getUncachableGoogleSheetClient();
    
    // Create a new spreadsheet for this course
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `${courseData.title} - Enrollments`,
        },
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId!;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    
    console.log(`[Google Sheets] Created spreadsheet for "${courseData.title}": ${spreadsheetId}`);
    
    // Update course with Google Sheet info
    await db
      .update(courses)
      .set({
        googleSheetId: spreadsheetId,
        googleSheetUrl: spreadsheetUrl,
        updatedAt: new Date()
      })
      .where(eq(courses.id, courseId));
    
    // Export current enrollments to the new sheet
    await exportCourseEnrollmentsToSheet(courseId, spreadsheetId, sheets);
    
    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl
    };
  } catch (error) {
    console.error(`[Google Sheets] Error creating sheet for course ${courseId}:`, error);
    return { 
      success: false, 
      error: handleGoogleSheetsError(error)
    };
  }
}

/**
 * Exports campaign team registrations to a specific Google Sheet
 */
export async function exportCampaignRegistrationsToSheet(
  campaignId: number, 
  spreadsheetId: string, 
  sheets?: any
): Promise<ExportResult> {
  try {
    if (!sheets) {
      sheets = await getUncachableGoogleSheetClient();
    }
    
    console.log(`[Google Sheets] Exporting registrations for campaign ${campaignId} to sheet ${spreadsheetId}`);
    
    // Get all registrations for this campaign
    const registrations = await db
      .select()
      .from(campaignTeamRegistrations)
      .where(eq(campaignTeamRegistrations.campaignId, campaignId));

    if (registrations.length === 0) {
      console.log(`[Google Sheets] No registrations found for campaign ${campaignId}`);
      return { success: true };
    }

    console.log(`[Google Sheets] Found ${registrations.length} registrations for campaign ${campaignId}`);

    // Prepare header row
    const headers = [
      'Registration ID',
      'Registration Date',
      'Status',
      'School Name',
      'Team Leader Name',
      'Team Leader Email',
      'Team Leader Phone',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Phone',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Phone',
      'Member 4 Name',
      'Member 4 Email',
      'Member 4 Phone',
      'Member 5 Name',
      'Member 5 Email',
      'Member 5 Phone',
      'Mentor Name',
      'Mentor Email',
      'Mentor Phone',
    ];

    // Prepare data rows
    const rows = registrations.map((reg) => [
      reg.id.toString(),
      reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : '',
      reg.status || 'pending',
      reg.schoolName || '',
      reg.teamLeaderName || '',
      reg.teamLeaderEmail || '',
      reg.teamLeaderPhone || '',
      reg.teamMember2Name || '',
      reg.teamMember2Email || '',
      reg.teamMember2Phone || '',
      reg.teamMember3Name || '',
      reg.teamMember3Email || '',
      reg.teamMember3Phone || '',
      reg.teamMember4Name || '',
      reg.teamMember4Email || '',
      reg.teamMember4Phone || '',
      reg.teamMember5Name || '',
      reg.teamMember5Email || '',
      reg.teamMember5Phone || '',
      reg.mentorName || '',
      reg.mentorEmail || '',
      reg.mentorPhone || '',
    ]);

    // Clear existing data and write new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Sheet1!A1:Z',
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows],
      },
    });

    // Format header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2,
                    green: 0.4,
                    blue: 0.8,
                  },
                  textFormat: {
                    bold: true,
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
        ],
      },
    });

    console.log(`[Google Sheets] Successfully exported ${registrations.length} registrations for campaign ${campaignId}`);
    return { success: true };
  } catch (error) {
    console.error(`[Google Sheets] Error exporting registrations for campaign ${campaignId}:`, error);
    return { 
      success: false, 
      error: handleGoogleSheetsError(error)
    };
  }
}

/**
 * Exports course enrollments to a specific Google Sheet
 */
export async function exportCourseEnrollmentsToSheet(
  courseId: number, 
  spreadsheetId: string, 
  sheets?: any
): Promise<ExportResult> {
  try {
    if (!sheets) {
      sheets = await getUncachableGoogleSheetClient();
    }
    
    console.log(`[Google Sheets] Exporting enrollments for course ${courseId} to sheet ${spreadsheetId}`);
    
    // Get all enrollments for this course with user details
    const enrollments = await db
      .select({
        enrollmentId: courseEnrollments.id,
        enrollmentDate: courseEnrollments.enrollmentDate,
        status: courseEnrollments.status,
        progress: courseEnrollments.progress,
        completedLessons: courseEnrollments.completedLessons,
        totalTimeSpent: courseEnrollments.totalTimeSpent,
        lastAccessed: courseEnrollments.lastAccessed,
        certificateIssued: courseEnrollments.certificateIssued,
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        userType: users.userType,
        institution: users.institution,
      })
      .from(courseEnrollments)
      .leftJoin(users, eq(courseEnrollments.userId, users.id))
      .where(eq(courseEnrollments.courseId, courseId));

    if (enrollments.length === 0) {
      console.log(`[Google Sheets] No enrollments found for course ${courseId}`);
      return { success: true };
    }

    console.log(`[Google Sheets] Found ${enrollments.length} enrollments for course ${courseId}`);

    // Prepare header row
    const headers = [
      'Enrollment ID',
      'Enrollment Date',
      'Status',
      'Progress (%)',
      'Completed Lessons',
      'Total Time Spent (min)',
      'Last Accessed',
      'Certificate Issued',
      'User ID',
      'First Name',
      'Last Name',
      'Email',
      'User Type',
      'Institution',
    ];

    // Prepare data rows
    const rows = enrollments.map((enrollment) => [
      enrollment.enrollmentId.toString(),
      enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString('en-IN') : '',
      enrollment.status || 'enrolled',
      enrollment.progress?.toString() || '0',
      enrollment.completedLessons?.toString() || '0',
      enrollment.totalTimeSpent?.toString() || '0',
      enrollment.lastAccessed ? new Date(enrollment.lastAccessed).toLocaleDateString('en-IN') : '',
      enrollment.certificateIssued ? 'Yes' : 'No',
      enrollment.userId || '',
      enrollment.firstName || '',
      enrollment.lastName || '',
      enrollment.email || '',
      enrollment.userType || '',
      enrollment.institution || '',
    ]);

    // Clear existing data and write new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Sheet1!A1:Z',
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows],
      },
    });

    // Format header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2,
                    green: 0.4,
                    blue: 0.8,
                  },
                  textFormat: {
                    bold: true,
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
        ],
      },
    });

    console.log(`[Google Sheets] Successfully exported ${enrollments.length} enrollments for course ${courseId}`);
    return { success: true };
  } catch (error) {
    console.error(`[Google Sheets] Error exporting enrollments for course ${courseId}:`, error);
    return { 
      success: false, 
      error: handleGoogleSheetsError(error)
    };
  }
}

/**
 * Main function to handle campaign registration export
 * Creates a new sheet if it doesn't exist, otherwise updates existing sheet
 */
export async function handleCampaignRegistrationExport(campaignId: number): Promise<ExportResult> {
  try {
    console.log(`[Google Sheets] Handling registration export for campaign ${campaignId}`);
    
    // Check if campaign already has a Google Sheet
    const campaign = await db
      .select({ googleSheetId: campaigns.googleSheetId })
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);
    
    if (campaign.length > 0 && campaign[0].googleSheetId) {
      // Update existing sheet
      console.log(`[Google Sheets] Updating existing sheet for campaign ${campaignId}`);
      const result = await exportCampaignRegistrationsToSheet(campaignId, campaign[0].googleSheetId);
      return result;
    } else {
      // Create new sheet
      console.log(`[Google Sheets] Creating new sheet for campaign ${campaignId}`);
      return await createCampaignGoogleSheet(campaignId);
    }
  } catch (error) {
    console.error(`[Google Sheets] Error handling campaign registration export for ${campaignId}:`, error);
    return { 
      success: false, 
      error: handleGoogleSheetsError(error)
    };
  }
}

/**
 * Main function to handle course enrollment export
 * Creates a new sheet if it doesn't exist, otherwise updates existing sheet
 */
export async function handleCourseEnrollmentExport(courseId: number): Promise<ExportResult> {
  try {
    console.log(`[Google Sheets] Handling enrollment export for course ${courseId}`);
    
    // Check if course already has a Google Sheet
    const course = await db
      .select({ googleSheetId: courses.googleSheetId })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);
    
    if (course.length > 0 && course[0].googleSheetId) {
      // Update existing sheet
      console.log(`[Google Sheets] Updating existing sheet for course ${courseId}`);
      const result = await exportCourseEnrollmentsToSheet(courseId, course[0].googleSheetId);
      return result;
    } else {
      // Create new sheet
      console.log(`[Google Sheets] Creating new sheet for course ${courseId}`);
      return await createCourseGoogleSheet(courseId);
    }
  } catch (error) {
    console.error(`[Google Sheets] Error handling course enrollment export for ${courseId}:`, error);
    return { 
      success: false, 
      error: handleGoogleSheetsError(error)
    };
  }
}
