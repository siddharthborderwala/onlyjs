import { DBSchema, openDB, IDBPDatabase } from 'idb'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface CodeDBSchema extends DBSchema {
  files: {
    key: string
    value: string
  }
}

class CodeDB {
  db: Promise<IDBPDatabase<CodeDBSchema>>
  constructor() {
    this.db = openDB<CodeDBSchema>('code', 1, {
      upgrade(db) {
        db.createObjectStore('files')
      }
    })
  }
  async getItem(key: string) {
    const result = await (await this.db).get('files', key)
    if (result === undefined) {
      return null
    }
    return result
  }
  async setItem(key: string, val: string) {
    await (await this.db).put('files', val, key)
  }
  async removeItem(key: string) {
    await (await this.db).delete('files', key)
  }
}

const codeDB = new CodeDB()

export const useCode = (filename: string) => {
  const [_code, _setCode] = useState<string | null>(null)

  const code = useMemo(() => _code ?? '', [_code])

  const setCode = useCallback((code: string) => {
    _setCode(code)
  }, [])

  useEffect(() => {
    if (_code !== null) {
      codeDB.setItem(filename, _code)
    }
  }, [filename, _code])

  useEffect(() => {
    codeDB.getItem(filename).then(_setCode)
  }, [filename, _setCode])

  return [code, setCode] as const
}
