import { db } from "../db";
import { campaigns, campaignTeamRegistrations } from "@shared/schema";
import { eq } from "drizzle-orm";
import { getUncachableGoogleSheetClient } from "../googleSheetClient";

export async function exportCampaignsToGoogleSheets() {
  try {
    console.log('[Google Sheets Export] Starting daily export job...');
    
    // Get all campaigns with status "Accepting Registrations"
    const activeCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.status, 'Accepting Registrations'));
    
    if (!activeCampaigns || activeCampaigns.length === 0) {
      console.log('[Google Sheets Export] No campaigns accepting registrations found');
      return;
    }

    console.log(`[Google Sheets Export] Found ${activeCampaigns.length} campaigns accepting registrations`);

    // Get Google Sheets client
    const sheets = await getUncachableGoogleSheetClient();

    // Check if spreadsheet exists in environment variable
    let spreadsheetId = process.env.CAMPAIGN_REGISTRATIONS_SHEET_ID;

    if (!spreadsheetId) {
      // Create a new spreadsheet
      console.log('[Google Sheets Export] Creating new spreadsheet...');
      const createResponse = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Campaign Registrations - ${new Date().toLocaleDateString('en-IN')}`,
          },
        },
      });

      spreadsheetId = createResponse.data.spreadsheetId!;
      console.log(`[Google Sheets Export] Created spreadsheet: ${spreadsheetId}`);
      console.log(`[Google Sheets Export] IMPORTANT: Add this to your secrets: CAMPAIGN_REGISTRATIONS_SHEET_ID=${spreadsheetId}`);
    }

    let totalExported = 0;

    // Process each campaign
    for (const campaign of activeCampaigns) {
      console.log(`[Google Sheets Export] Processing campaign: ${campaign.title}`);
      
      // Get all registrations for this campaign
      const registrations = await db
        .select()
        .from(campaignTeamRegistrations)
        .where(eq(campaignTeamRegistrations.campaignId, campaign.id));

      if (registrations.length === 0) {
        console.log(`[Google Sheets Export] No registrations found for ${campaign.title}`);
        continue;
      }

      console.log(`[Google Sheets Export] Found ${registrations.length} registrations for ${campaign.title}`);
      totalExported += registrations.length;

      // Create a safe sheet name (Google Sheets has character limits and restrictions)
      const sheetName = campaign.title.substring(0, 100).replace(/[\\/?*[\]]/g, '');
      
      // Check if sheet exists, if not create it
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const existingSheet = spreadsheet.data.sheets?.find(
        sheet => sheet.properties?.title === sheetName
      );

      let sheetId = existingSheet?.properties?.sheetId;

      if (!existingSheet) {
        // Create new sheet for this campaign
        const addSheetResponse = await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
        sheetId = addSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;
        console.log(`[Google Sheets Export] Created new sheet: ${sheetName}`);
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
        range: `${sheetName}!A1:Z`,
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers, ...rows],
        },
      });

      // Format header row for this sheet
      if (sheetId !== undefined) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: sheetId,
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
      }

      console.log(`[Google Sheets Export] Successfully exported ${registrations.length} registrations for ${campaign.title}`);
    }

    console.log(`[Google Sheets Export] Total exported: ${totalExported} registrations across ${activeCampaigns.length} campaigns`);
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
    exportCampaignsToGoogleSheets()
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
