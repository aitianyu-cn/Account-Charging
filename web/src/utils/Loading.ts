/**@format */

import { loadI18n } from "@aitianyu.cn/tianyu-shell/infra";
import { ITianyuShellInitial, initialTianyuShellAsync } from "@aitianyu.cn/tianyu-shell";
import { TianyuShellConfigure } from "./TianyuShellConfigure";

export async function loading(configure: ITianyuShellInitial = TianyuShellConfigure) {
    await initialTianyuShellAsync(configure);
    await loadI18n();

    const core = await import(/*webpackChunkName: "tianyu-shell/core" */ "@aitianyu.cn/tianyu-shell/core");

    return core;
}
