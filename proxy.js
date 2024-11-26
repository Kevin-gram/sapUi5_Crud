const express = require("express")
const cors = require("cors")
const {createProxyMiddleware} = require('http-proxy-middleware')

const app = express()
app.use(cors())

app.use("/odata", createProxyMiddleware({
    target: "https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/",
    changeOrigin: true,
    pathRewrite: {
        '^/odata': ''
    }
}))

app.listen(5000,()=>{
    console.log('Proxy server running at http://localhost:5000');
})