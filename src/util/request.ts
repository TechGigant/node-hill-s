async function phin(options) {
    if (typeof options === "string") {
        options = { url: options }
    }
    
    const url = options.url
    const fetchOptions: any = {
        method: options.method || 'GET',
        headers: options.headers || {}
    }

    if (options.timeout) {
        fetchOptions.signal = AbortSignal.timeout(options.timeout)
    }

    if (options.data) {
        fetchOptions.body = JSON.stringify(options.data)
        fetchOptions.headers = {
            ...fetchOptions.headers,
            'Content-Type': 'application/json'
        }
    }

    const res = await fetch(url, fetchOptions)
    const bodyText = await res.text()

    let parsed = bodyText
    if (options.parse === "json" || options.coreParse === "json") {
        try { parsed = JSON.parse(bodyText) } catch (e) {}
    }

    return { body: parsed, statusCode: res.status }
}

phin.defaults = function(defaultOptions) {
    const fn = async (options) => {
        return phin(Object.assign({}, defaultOptions, options))
    }
    fn.defaults = this.defaults
    return fn
}

module.exports = phin
