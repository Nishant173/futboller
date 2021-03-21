/*
Takes URL resource and object of query-params.
Returns URL string with query-params appended to the URL resource.
Example: addQueryParamsToUrl("www.example.com/", {param1: "value1", param2: "value2"})
*/
export function addQueryParamsToUrl(url="", objQueryParams={}) {
    let queryParams = "?"
    for (const [key, value] of Object.entries(objQueryParams)) {
        queryParams += `${key}=${value}&`
    }
    queryParams = queryParams.slice(0, queryParams.length - 1)
    return url + queryParams
}