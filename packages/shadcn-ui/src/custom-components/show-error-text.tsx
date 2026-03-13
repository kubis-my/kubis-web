'use client';

import { useEffect, useState } from 'react';

export default function ShowErrorText(props: { error: Record<string, string[]>; field: string }) {
    const [text, setText] = useState<string | undefined>();

    useEffect(() => {
        setText(props.error[props.field]?.at(-1));
    }, [props.error]);

    if (!text) return <></>;

    return (
        <span className="ml-1 text-xs font-semibold text-red-500" role="alert">
            {text}
        </span>
    );
}
