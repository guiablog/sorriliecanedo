import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats plain text with newlines into HTML paragraphs and line breaks.
 * @param text - The plain text to format.
 * @returns An HTML string with <p> and <br> tags.
 */
export function formatContentText(text: string): string {
  if (!text) {
    return ''
  }

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const lines = paragraph.trim().replace(/\n/g, '<br />')
      return `<p>${lines}</p>`
    })
    .join('')
}
