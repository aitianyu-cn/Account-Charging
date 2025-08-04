/** @format */

export async function getter(_data: { id: string }): Promise<any> {
    return {
        name: "Test Admin",
        license: "Test_Admin",
    };
}
