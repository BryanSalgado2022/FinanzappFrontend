import { useState } from 'react'
import { CHANGELOG } from '../data/changelog'

const STORAGE_KEY = 'tobe.changelogSeen'

const newestId = CHANGELOG[0]?.id ?? null

export function useChangelogSeen() {
  const [lastSeenId, setLastSeenId] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  const hasUnseen = newestId !== null && newestId !== lastSeenId

  const markSeen = () => {
    if (newestId === null) return
    localStorage.setItem(STORAGE_KEY, newestId)
    setLastSeenId(newestId)
  }

  return { hasUnseen, markSeen }
}
