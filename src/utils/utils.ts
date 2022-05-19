export function getTime(): string {
    return new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
}