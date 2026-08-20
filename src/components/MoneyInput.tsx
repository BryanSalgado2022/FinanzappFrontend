import { useLayoutEffect, useRef, type ChangeEvent } from 'react'

// es-CO convention: "." groups thousands, "," is the decimal separator -
// matches formatCOP's display elsewhere in the app.
function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Counts digits *and* the decimal comma (never the grouping dots) - the
// comma has to count as a position too, otherwise restoring the cursor
// right after a freshly-typed separator lands it one character too early
// (before the comma instead of after it), so digits typed next get
// inserted on the wrong side of the separator.
function significantCharsBeforeIndex(str: string, index: number): number {
  return (str.slice(0, index).match(/[\d,]/g) ?? []).length
}

function indexAfterSignificantChars(str: string, count: number): number {
  if (count <= 0) return 0
  let seen = 0
  for (let i = 0; i < str.length; i++) {
    if (/[\d,]/.test(str[i])) {
      seen += 1
      if (seen === count) return i + 1
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
      const pos = indexAfterSignificantChars(displayValue, pendingCursorDigits.current)
      ref.current.setSelectionRange(pos, pos)
      pendingCursorDigits.current = null
    }
  }, [displayValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const raw = input.value
    const cursor = input.selectionStart ?? raw.length

    // Some mobile keyboards show "." instead of "," for the decimal key
    // (locale-dependent). "." already means "thousands group" in this
    // field's display, so only the period the user just pressed (not any
    // pre-existing grouping dots) gets reinterpreted as the decimal mark -
    // detected via the native InputEvent rather than guessed from raw.
    const typedChar = (event.nativeEvent as InputEvent).data
    const normalized =
      typedChar === '.' && !raw.includes(',') && raw[cursor - 1] === '.'
        ? raw.slice(0, cursor - 1) + ',' + raw.slice(cursor)
        : raw

    pendingCursorDigits.current = significantCharsBeforeIndex(normalized, cursor)

    const cleaned = normalized.replace(/[^\d,]/g, '')
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
