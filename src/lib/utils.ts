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
 * Validates a Brazilian CPF number.
 * @param cpf - The CPF string to validate. Can contain masks.
 * @returns True if the CPF is valid, false otherwise.
 */
export function isValidCPF(cpf: string): boolean {
  if (typeof cpf !== 'string') return false
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false
  const cpfDigits = cpf.split('').map((el) => +el)
  const rest = (count: number): number => {
    return (
      ((cpfDigits
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10
    )
  }
  return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10]
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
