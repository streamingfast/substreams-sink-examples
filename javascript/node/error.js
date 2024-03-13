
const isAppErrorUnresolvable = e => {
    if (e.message === "COULD_NOT_READ_CURSOR" || e.message === "COULD_NOT_COMMIT_CURSOR") {
        return true
    }
    
    return false
}

const isTransportErrorUnresolvable = e => {
    try {
        if (e.code === 16 || e.code === 3) {
            return true
        }

        return false
    } catch (e) {
        return true
    }
}

export const isErrorUnresolvable = (e) => {
    if (e instanceof Error) {
        return isAppErrorUnresolvable(e)
    }

    return isTransportErrorUnresolvable(e)
}