export const convertErrorMessageListToObject = (keys: string[], errors: string[]) => {
    const message: Record<string, string[]> = {}

    for (const k of keys) {
        message[k] = errors.filter(e => e.includes(k))
            .map((val) => val.replace(new RegExp(k), "This field"))
    }

    return message;
}