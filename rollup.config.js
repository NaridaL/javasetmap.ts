import * as fs from "fs"
import typescriptPlugin from "@rollup/plugin-typescript"
import typescript from "typescript"

const compress = false
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"))
export default {
  input: "src/index.ts",
  output: ["umd", "es"].map(format =>
    ({
      format,
      entryFileNames: "[name].[format]" + (compress ? ".min" : "") + ".js",
      sourcemap: true,
      name: pkg.umdGlobal,
      dir: "lib",
      sourcemapExcludeSources: true
    })),
  external: Object.keys(pkg.dependencies || {}),
  plugins: [typescriptPlugin({ typescript })],
  onwarn: function(warning, warn) {
    // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if ("THIS_IS_UNDEFINED" === warning.code) return
    if ("CIRCULAR_DEPENDENCY" === warning.code) return

    warn(warning)
  }
}
