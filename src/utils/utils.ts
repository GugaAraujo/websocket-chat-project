function getTime(): Date {
    return new Date()
}

function log(...args): void{
    console.log(...args)
}

export { getTime, log }