/** @format */

export async function getter(_data: { id: string }): Promise<any> {
    return [
        {
            name: "financial",
            read: true,
            write: true,
            delete: true,
            change: true,
            execute: true,
        },
    ];
}
