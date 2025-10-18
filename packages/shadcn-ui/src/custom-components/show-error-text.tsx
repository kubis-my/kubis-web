"use client";

import { useEffect, useState } from 'react'

export default function ShowErrorText(
    props: {
        error: Record<string, string[]>
        field: string
    }
) {
    const [text, setText] = useState<string | undefined>();

    useEffect(() => {
        setText(props.error[props.field]?.at(-1))
    }, [props.error])

    if (!text) return <></>

    return (
        <span
            className="text-xs text-red-500 -mt-2 ml-1 font-semibold"
            role="alert"
        >
            {text}
        </span>
    )
}
