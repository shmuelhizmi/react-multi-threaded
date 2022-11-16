const path = require("path")

module.exports = {
    mode: "none",
    entry: {
        main: path.join(__dirname, "src", "main.tsx"),
        worker: path.join(__dirname, "src", "index.tsx"),
    },
    target: "web",
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            react: path.resolve("./node_modules/react"),
            "react-multi-threaded": path.resolve(__dirname, "../react-multi-threaded"),
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
