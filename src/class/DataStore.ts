import * as fs from "node:fs"
import { join, resolve } from "node:path"

const DATA_DIR = resolve(process.cwd(), "data")

// Ensure data directory exists on load
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
}

/**
 * A simple JSON-backed key-value data store for persisting game data.
 * 
 * Each DataStore instance maps to a single JSON file in the `data/` directory.
 * Data is stored as key-value pairs and can be saved/loaded at any time.
 * 
 * @example
 * ```js
 * // Create or open a datastore called "playerScores"
 * const scores = new DataStore("playerScores")
 * 
 * Game.on("playerJoin", async (player) => {
 *     // Load saved score, default to 0
 *     const saved = scores.get(player.userId, 0)
 *     player.setScore(saved)
 * })
 * 
 * Game.on("playerLeave", (player) => {
 *     // Save player's score when they leave
 *     scores.set(player.userId, player.score)
 *     scores.save()
 * })
 * ```
 */
export class DataStore {
    /** The name of this datastore (also the filename without extension). */
    name: string

    /** The in-memory data object. */
    private data: Record<string, any>

    /** The file path this datastore reads/writes to. */
    private filePath: string

    /**
     * Creates or opens a DataStore.
     * If a file with this name already exists in `data/`, it is loaded automatically.
     * @param name - The name of the datastore (alphanumeric, underscores, hyphens only).
     */
    constructor(name: string) {
        // Sanitize name to prevent path traversal
        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            throw new Error(`DataStore name "${name}" is invalid. Use only letters, numbers, underscores, and hyphens.`)
        }

        this.name = name
        this.filePath = join(DATA_DIR, `${name}.json`)
        this.data = {}

        // Auto-load if file exists
        if (fs.existsSync(this.filePath)) {
            try {
                const raw = fs.readFileSync(this.filePath, { encoding: "utf-8" })
                this.data = JSON.parse(raw)
            } catch (err) {
                console.warn(`[DataStore] Warning: Failed to load "${name}", starting with empty data.`)
                this.data = {}
            }
        }
    }

    /**
     * Gets a value by key.
     * @param key - The key to look up.
     * @param defaultValue - Value to return if key doesn't exist.
     * @returns The stored value, or `defaultValue` if not found.
     * 
     * @example
     * ```js
     * const coins = store.get(player.userId, 0)
     * ```
     */
    get(key: string | number, defaultValue?: any): any {
        const k = String(key)
        if (k in this.data) return this.data[k]
        return defaultValue
    }

    /**
     * Sets a value by key (in memory). Call `.save()` to persist to disk.
     * @param key - The key to set.
     * @param value - The value to store (must be JSON-serializable).
     * 
     * @example
     * ```js
     * store.set(player.userId, { score: 100, level: 5 })
     * store.save()
     * ```
     */
    set(key: string | number, value: any): void {
        this.data[String(key)] = value
    }

    /**
     * Deletes a key from the store.
     * @param key - The key to delete.
     * @returns `true` if the key existed, `false` otherwise.
     */
    delete(key: string | number): boolean {
        const k = String(key)
        if (k in this.data) {
            delete this.data[k]
            return true
        }
        return false
    }

    /**
     * Checks if a key exists in the store.
     * @param key - The key to check.
     */
    has(key: string | number): boolean {
        return String(key) in this.data
    }

    /**
     * Returns all keys in the store.
     */
    keys(): string[] {
        return Object.keys(this.data)
    }

    /**
     * Returns all entries as an array of `[key, value]` pairs.
     */
    entries(): [string, any][] {
        return Object.entries(this.data)
    }

    /**
     * Saves the current data to disk as JSON.
     * 
     * @example
     * ```js
     * store.set("totalGames", store.get("totalGames", 0) + 1)
     * store.save()
     * ```
     */
    save(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), { encoding: "utf-8" })
        } catch (err) {
            console.error(`[DataStore] Error saving "${this.name}":`, err)
        }
    }

    /**
     * Reloads data from disk, discarding any unsaved in-memory changes.
     */
    reload(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                const raw = fs.readFileSync(this.filePath, { encoding: "utf-8" })
                this.data = JSON.parse(raw)
            }
        } catch (err) {
            console.error(`[DataStore] Error reloading "${this.name}":`, err)
        }
    }

    /**
     * Clears all data from this store (in memory). Call `.save()` to persist.
     */
    clear(): void {
        this.data = {}
    }

    /**
     * Returns the number of entries in the store.
     */
    get size(): number {
        return Object.keys(this.data).length
    }
}

export default DataStore
