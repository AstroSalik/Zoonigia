import { db } from "../db";
import { campaigns, campaignTeamRegistrations } from "@shared/schema";
import { eq } from "drizzle-orm";
import { getUncachableGoogleSheetClient } from "../googleSheetClient";

export async function exportYouthIdeathonToGoogleSheets() {
  try {
    console.log('[Google Sheets Export] Starting daily export job...');
    
    // Get Youth Ideathon campaign
    const youthIdeathon = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.title, 'Youth Ideathon 2025'))
      .limit(1);
    
    if (!youthIdeathon || youthIdeathon.length === 0) {
      console.log('[Google Sheets Export] Youth Ideathon 2025 campaign not found');
      return;
    }

    const campaignId = youthIdeathon[0].id;

    // Get all registrations for Youth Ideathon
    const registrations = await db
      .select()
      .from(campaignTeamRegistrations)
      .where(eq(campaignTeamRegistrations.campaignId, campaignId));

    if (registrations.length === 0) {
      console.log('[Google Sheets Export] No registrations found for Youth Ideathon 2025');
      return;
    }

    console.log(`[Google Sheets Export] Found ${registrations.length} registrations`);

    // Get Google Sheets client
    const sheets = await getUncachableGoogleSheetClient();

    // Check if spreadsheet exists in environment variable
    let spreadsheetId = process.env.YOUTH_IDEATHON_SHEET_ID;

    if (!spreadsheetId) {
      // Create a new spreadsheet
      console.log('[Google Sheets Export] Creating new spreadsheet...');
      const createResponse = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Youth Ideathon 2025 - Registrations (${new Date().toLocaleDateString()})`,
          },
          sheets: [
            {
              properties: {
                title: 'Registrations',
              },
            },
          ],
        },
      });

      spreadsheetId = createResponse.data.spreadsheetId!;
      console.log(`[Google Sheets Export] Created spreadsheet: ${spreadsheetId}`);
      console.log(`[Google Sheets Export] IMPORTANT: Add this to your secrets: YOUTH_IDEATHON_SHEET_ID=${spreadsheetId}`);
    }

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
      range: 'Registrations!A1:Z',
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Registrations!A1',
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

    console.log(`[Google Sheets Export] Successfully exported ${registrations.length} registrations to Google Sheets`);
    console.log(`[Google Sheets Export] Spreadsheet ID: ${spreadsheetId}`);
    
    return spreadsheetId;
  } catch (error) {
    console.error('[Google Sheets Export] Error:', error);
    throw error;
  }
}

// Function to schedule daily export at 11 PM
export function scheduleDailyExport() {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, // 11 PM
    0,
    0
  );

  // If it's already past 11 PM today, schedule for tomorrow
  if (now >= scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilExport = scheduledTime.getTime() - now.getTime();

  console.log(`[Google Sheets Export] Next export scheduled for: ${scheduledTime.toLocaleString('en-IN')}`);

  setTimeout(() => {
    exportYouthIdeathonToGoogleSheets()
      .then(() => {
        console.log('[Google Sheets Export] Daily export completed successfully');
        // Schedule next export (24 hours later)
        setTimeout(() => scheduleDailyExport(), 1000);
      })
      .catch((error) => {
        console.error('[Google Sheets Export] Daily export failed:', error);
        // Still schedule next export even if this one failed
        setTimeout(() => scheduleDailyExport(), 1000);
      });
  }, timeUntilExport);
}
