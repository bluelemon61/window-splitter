export interface BoxWindowObject {
    scale?: number | undefined
    boxWindow: ({ scale }: {
        scale?: number | undefined;
    }) => JSX.Element
}