const CURSOR_LOCAL_STORAGE = "cursor"

export const getCursor = async () => {
    const item = localStorage.getItem(CURSOR_LOCAL_STORAGE);

    if (item === null) {
        throw new Error("COULD_NOT_READ_CURSOR");
    }

    return item
}
  
// In this example, the cursor is persisted in the local storage of the browser.
export const writeCursor = async cursor => {
    try {
        localStorage.setItem(CURSOR_LOCAL_STORAGE, cursor);
    } catch (e) {
        throw new Error("COULD_NOT_COMMIT_CURSOR");
    }
}