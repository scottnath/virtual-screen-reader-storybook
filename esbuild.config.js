/**
 * @fileoverview esbuild configuration and build to replace __dirname in ffmpeg-static
 */
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
const nodeModules = new RegExp(/^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/);

/**
 * Modified plugin sourced from esbuild issue
 * @see https://github.com/evanw/esbuild/issues/859
 */
const dirnamePlugin = {
  name: "dirname",
  setup(build) {
    build.onLoad({ filter: /.*/ }, ({ path: filePath }) => {
        let contents = fs.readFileSync(filePath, "utf8");
        const loader = path.extname(filePath).substring(1);
        const dirname = path.dirname(filePath);
        contents = contents
          .replaceAll("__dirname", `"${dirname}"`)
          .replaceAll("__filename", `"${filePath}"`);
        return {
          contents,
          loader,
        };
    });
  },
};

/**
 * Currently just used to convert ffmpeg-static to use __dirname
 */
esbuild.build({
  entryPoints: ['./node_modules/ffmpeg-static/index.js'],
  allowOverwrite: true,
  platform: 'node',
  outdir: './node_modules/ffmpeg-static/',
  plugins: [
    dirnamePlugin,
  ],
});
