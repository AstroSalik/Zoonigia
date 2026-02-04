-- Add Google Sheets tracking fields to campaigns and courses tables
ALTER TABLE campaigns ADD COLUMN google_sheet_id VARCHAR;
ALTER TABLE campaigns ADD COLUMN google_sheet_url VARCHAR;

ALTER TABLE courses ADD COLUMN google_sheet_id VARCHAR;
ALTER TABLE courses ADD COLUMN google_sheet_url VARCHAR;
