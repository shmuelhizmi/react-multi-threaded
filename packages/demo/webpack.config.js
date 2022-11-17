const path = require("path")

module.exports = {
    mode: "none",
    entry: {
        index: path.join(__dirname, "src", "index.tsx"),
        worker: path.join(__dirname, "src", "worker.tsx"),
        footer: path.join(__dirname, "src", "footer.worker.tsx"),
    },
    target: "web",
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            react: path.resolve("./node_modules/react"),
            "react-multi-threaded": path.resolve(__dirname, "../react-multi-threaded"),
            "react-multi-threaded/src": path.resolve(__dirname, "../react-multi-threaded/src"),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node_modules/",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
        ],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "public"),
    },

}
