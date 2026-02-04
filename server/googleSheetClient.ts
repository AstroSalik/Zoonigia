import { google } from 'googleapis';

let connectionSettings: any;
let lastTokenRefresh: number = 0;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

interface GoogleSheetsError extends Error {
  code?: number;
  status?: string;
  details?: any;
}

async function getAccessToken(): Promise<string> {
  try {
    // Check if we have a valid cached token
    if (connectionSettings && 
        connectionSettings.settings.expires_at && 
        new Date(connectionSettings.settings.expires_at).getTime() > Date.now() &&
        (Date.now() - lastTokenRefresh) < TOKEN_REFRESH_INTERVAL) {
      return connectionSettings.settings.access_token;
    }
    
    console.log('[Google Sheets] Refreshing access token...');
    
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY 
      ? 'repl ' + process.env.REPL_IDENTITY 
      : process.env.WEB_REPL_RENEWAL 
      ? 'depl ' + process.env.WEB_REPL_RENEWAL 
      : null;

    if (!xReplitToken) {
      throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }

    if (!hostname) {
      throw new Error('REPLIT_CONNECTORS_HOSTNAME not found');
    }

    const response = await fetch(
      `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=google-sheet`,
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch connection settings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    connectionSettings = data.items?.[0];

    if (!connectionSettings) {
      throw new Error('No Google Sheets connection found. Please connect Google Sheets in Replit.');
    }

    const accessToken = connectionSettings?.settings?.access_token || 
                       connectionSettings?.settings?.oauth?.credentials?.access_token;

    if (!accessToken) {
      throw new Error('No access token found in Google Sheets connection settings');
    }

    lastTokenRefresh = Date.now();
    console.log('[Google Sheets] Access token refreshed successfully');
    return accessToken;
  } catch (error) {
    console.error('[Google Sheets] Error getting access token:', error);
    throw new Error(`Google Sheets authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getUncachableGoogleSheetClient() {
  try {
    const accessToken = await getAccessToken();

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken
    });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    
    // Test the connection with a simple API call
    try {
      await sheets.spreadsheets.get({ spreadsheetId: 'test' });
    } catch (error: any) {
      // If it's a 404, the token is valid but the spreadsheet doesn't exist (which is expected)
      if (error.code !== 404) {
        throw error;
      }
    }
    
    return sheets;
  } catch (error) {
    console.error('[Google Sheets] Error creating client:', error);
    throw new Error(`Failed to create Google Sheets client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function isGoogleSheetsError(error: any): error is GoogleSheetsError {
  return error && typeof error === 'object' && (error.code || error.status);
}

export function handleGoogleSheetsError(error: any): string {
  if (isGoogleSheetsError(error)) {
    switch (error.code) {
      case 401:
        return 'Google Sheets authentication expired. Please reconnect Google Sheets.';
      case 403:
        return 'Google Sheets access denied. Please check permissions.';
      case 404:
        return 'Google Sheets not found. The spreadsheet may have been deleted.';
      case 429:
        return 'Google Sheets rate limit exceeded. Please try again later.';
      default:
        return `Google Sheets API error: ${error.message || 'Unknown error'}`;
    }
  }
  
  return error instanceof Error ? error.message : 'Unknown Google Sheets error';
}
