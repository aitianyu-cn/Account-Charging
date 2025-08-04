/** @format */

export async function getter(_data: { id: string }): Promise<any> {
    return {
        admin: true,
    };
}
