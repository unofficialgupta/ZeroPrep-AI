/**
 * Centralized Download Links Configuration
 *
 * Supports Google Drive links, GitHub Releases, AWS S3, or direct URLs.
 * If a Google Drive share link is used (e.g. https://drive.google.com/file/d/XYZ/view?usp=sharing),
 * it will be automatically converted to a direct download link.
 */

export function formatDirectDownloadUrl(url: string): string {
  if (!url) return '';
  // Convert standard Google Drive preview/share link to direct file download
  const gdriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdriveMatch[1]}`;
  }
  return url;
}

export const DOWNLOAD_LINKS = {
  // macOS (.dmg - Universal Apple Silicon & Intel)
  mac: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_MAC ||
    'https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-1.0.0.dmg'
  ),

  // Windows (.exe Setup)
  windows: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_WIN ||
    'https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-Setup-1.0.0.exe'
  ),

  // Linux (.AppImage)
  linux: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_LINUX ||
    'https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-1.0.0.AppImage'
  ),

  // Optional general Google Drive Folder link where all installers are stored
  driveFolder: process.env.NEXT_PUBLIC_DOWNLOAD_DRIVE_FOLDER || '',
};
