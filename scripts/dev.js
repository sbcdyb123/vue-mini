// 这个文件会帮我们打包 packages下的模块，最终打包出js文件

// node dev.js （要打包的名字 -f 打包的格式） => argv
import minimist from "minimist";
import { createRequire } from "module";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
// node中的命令行参数通过process.argv获取
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const target = args._[0] || "reactivity"; // 默认打包reactivity模块
const format = args.f || "iife"; // 默认打包成iife
// node中esm模块没有__dirname
console.log(__filename, __dirname);
// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
