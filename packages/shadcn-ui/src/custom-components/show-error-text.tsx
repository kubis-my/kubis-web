'use client';

import { useEffect, useState } from 'react';
import { cn } from '@repo/shadcn-ui/lib/utils';

type ShowErrorTextProps = React.ComponentProps<'span'> & {
    error: Record<string, string[]>; field: string
}

export default function ShowErrorText(props: ShowErrorTextProps) {
    const [text, setText] = useState<string | undefined>();

    useEffect(() => {
        setText(props.error[props.field]?.at(-1));
    }, [props.error]);

    if (!text) return <></>;

    return (
        <span className={cn("ml-1 text-xs font-semibold text-red-500", props.className)} role="alert">
            {text}
        </span>
    );
}
