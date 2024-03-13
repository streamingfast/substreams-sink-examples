import fs from "fs";

const CURSOR_FILE = "cursor"

export const getCursor = async () => {
    try {
        return await fs.promises.readFile(CURSOR_FILE)
    } catch(e) {
        return undefined
    }
}

// In this example, the cursor is persisted in a file.
export const writeCursor = async cursor => {
    try {
        await fs.promises.writeFile(CURSOR_FILE, cursor)
    } catch (e) {
        throw new Error("COULD_NOT_COMMIT_CURSOR")
    }
}