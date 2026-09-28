export function getHeader(
  headers: { name: string; value: string }[],
  name: string
) {
  return headers.find(
    header => header.name.toLowerCase() === name.toLowerCase()
  )?.value || '';
}