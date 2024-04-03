import { Code, ConnectError } from '@connectrpc/connect'

const FATAL_ERRORS = [Code.Unauthenticated, Code.InvalidArgument, Code.Internal]

const isAppErrorRetryable = (e: Error) => {
    if (e.message === "COULD_NOT_READ_CURSOR" || e.message === "COULD_NOT_COMMIT_CURSOR") {
        return false
    }
    
    return true
}

const isTransportErrorRetryable = (e: ConnectError) => {
    if (FATAL_ERRORS.includes(e.code)) {
        return false
    }

    return true
}

export const isErrorRetryable = (e: any) => {
    if (e.constructor.name === 'ConnectError') {    
        return isTransportErrorRetryable(e)
    }

    if (e instanceof Error) {
        return isAppErrorRetryable(e)
    }

    return false
}
