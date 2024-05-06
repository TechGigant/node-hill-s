import filterList from "./filter.json"

let regex = new RegExp(filterList.join("|"), "i")

function setFilter(filter: string[]): void {
    regex = new RegExp(filter.join("|"), "i")
}

function getFilter(): string[] {
    return filterList
}

function isSwear(input: string): boolean {
    return regex.test(input)
}

function addFilter(input: string){
    filterList.push(input)
    setFilter(filterList)
}

export default { getFilter, setFilter, isSwear, addFilter }
