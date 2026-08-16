import { useLayoutEffect, useRef, type ChangeEvent } from 'react'

// es-CO convention: "." groups thousands, "," is the decimal separator -
// matches formatCOP's display elsewhere in the app.
function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function digitsBeforeIndex(str: string, index: number): number {
  return (str.slice(0, index).match(/\d/g) ?? []).length
}

function indexAfterDigits(str: string, digitCount: number): number {
  if (digitCount <= 0) return 0
  let count = 0
  for (let i = 0; i < str.length; i++) {
    if (/\d/.test(str[i])) {
      count += 1
      if (count === digitCount) return i + 1
    }
  }
  return str.length
}

/** Money input that displays "1.000.000" while typing but reports back a
 * plain "1000000" (or "1000000.50") string - the shape the API expects. */
export function MoneyInput({
  value,
  onChange,
  placeholder,
  required,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const pendingCursorDigits = useRef<number | null>(null)

  const [integerPart, decimalPart] = value.split('.')
  const displayValue = value
    ? groupThousands(integerPart || '0') + (decimalPart !== undefined ? `,${decimalPart}` : '')
    : ''

  useLayoutEffect(() => {
    if (pendingCursorDigits.current !== null && ref.current) {
      const pos = indexAfterDigits(displayValue, pendingCursorDigits.current)
      ref.current.setSelectionRange(pos, pos)
      pendingCursorDigits.current = null
    }
  }, [displayValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const raw = input.value
    const cursor = input.selectionStart ?? raw.length
    pendingCursorDigits.current = digitsBeforeIndex(raw, cursor)

    const cleaned = raw.replace(/[^\d,]/g, '')
    const firstComma = cleaned.indexOf(',')
    const intPart = firstComma === -1 ? cleaned : cleaned.slice(0, firstComma)
    const decPart = firstComma === -1 ? '' : cleaned.slice(firstComma + 1).replace(/,/g, '')

    onChange(firstComma === -1 ? intPart : `${intPart}.${decPart}`)
  }

  return (
    <input
      ref={ref}
      inputMode="decimal"
      placeholder={placeholder}
      required={required}
      value={displayValue}
      onChange={handleChange}
      className={className}
    />
  )
}
