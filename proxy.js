const express = require("express")
const cors = require("cors")
const {createProxyMiddleware} = require('http-proxy-middleware')

const app = express()
app.use(cors())

app.use("/odata", createProxyMiddleware({
    target: "https://services.odata.org/v2/northwind/northwind.svc/",
    changeOrigin: true,
    pathRewrite: {
        '^/odata': ''
    }
}))

app.listen(3000,()=>{
    console.log('Proxy server running at http://localhost:3000');
})