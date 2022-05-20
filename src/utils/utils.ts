function getTime(): string {
    return new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
}

function log(...args): void{
    console.log(...args)
}

export { getTime, log }