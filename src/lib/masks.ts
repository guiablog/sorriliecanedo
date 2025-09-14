export const cpfMask = (value: string): string => {
  if (!value) return ''
  value = value.replace(/\D/g, '') // Remove all non-digit characters
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return value.slice(0, 14) // Ensure max length of XXX.XXX.XXX-XX
}

export const whatsappMask = (value: string): string => {
  if (!value) return ''
  value = value.replace(/\D/g, '') // Remove all non-digit characters
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  return value.slice(0, 15) // Ensure max length of (XX) XXXXX-XXXX
}
