export const createCode = (prefix: string, id: number): string =>  {
    return(`${prefix}-${id.toString().padStart(3, "0")}`);
};