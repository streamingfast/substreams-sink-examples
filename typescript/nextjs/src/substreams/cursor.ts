const CURSOR_LOCAL_STORAGE = "cursor"

export const getCursor = (): string|null => {
    try {
        return localStorage.getItem(CURSOR_LOCAL_STORAGE);
    } catch {
        return null;
    }
}

// In this example, the cursor is persisted in the local storage of the browser.
export const writeCursor = (cursor: string) => {
    try {
        localStorage.setItem(CURSOR_LOCAL_STORAGE, cursor);
    } catch (e) {
        throw new Error("COULD_NOT_COMMIT_CURSOR");
    }
}