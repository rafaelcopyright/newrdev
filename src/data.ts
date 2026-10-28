import wordpress from './content/index.json';

export type ContentEntry = (typeof wordpress.entries)[number];
export type Post = ContentEntry;
export type Project = ContentEntry;
export const posts = wordpress.entries
  .filter((entry) => entry.kind === 'post')
  .sort((a, b) => b.published.localeCompare(a.published));
export const projects = wordpress.entries.filter((entry) => entry.kind === 'portfolio');
export const entries = wordpress.entries;
export const archives = wordpress.archives;
