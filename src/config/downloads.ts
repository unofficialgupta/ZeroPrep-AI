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
  // macOS (.dmg - Apple Silicon M1/M2/M3/M4)
  macArm: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_MAC_ARM ||
    'https://drive.google.com/file/d/15FWXMPQjoICaUWLrTb_W-1F_XmO3ZVGw/view?usp=sharing'
  ),

  // macOS (.dmg - Intel x64)
  macIntel: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_MAC_INTEL ||
    'https://drive.google.com/file/d/1E-w4GLGBSN_EjFNtF5DVxvkl63wra9Mu/view?usp=sharing'
  ),

  // Default macOS link (points to Apple Silicon installer)
  mac: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_MAC ||
    'https://drive.google.com/file/d/15FWXMPQjoICaUWLrTb_W-1F_XmO3ZVGw/view?usp=sharing'
  ),

  // Windows (.exe NSIS Setup)
  windows: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_WIN ||
    'https://drive.google.com/file/d/1z5wXyrApoXd68b5qZ_5tb1WIjEOxs58c/view?usp=sharing'
  ),

  // Linux (.AppImage)
  linux: formatDirectDownloadUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_LINUX ||
    'https://drive.google.com/file/d/1jynuUgi2rxuxYJg7hW-gIh_UwPtUAMkj/view?usp=sharing'
  ),

  // Optional general Google Drive Folder link where all installers are stored
  driveFolder: process.env.NEXT_PUBLIC_DOWNLOAD_DRIVE_FOLDER || '',
};

