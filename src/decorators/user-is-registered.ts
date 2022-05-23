import { getTime, log } from 'src/utils/utils'

export function userIsRegistered(reason: string){

    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    )   {

        const method = descriptor.value
        descriptor.value = function(...args: any[]) {

            args.forEach(parameter =>{
                const ejectSocket = parameter.id && parameter.nsp && !this.userService.getUser(parameter.id)
                const ejectMessage = parameter.name && !parameter.name

                if(ejectSocket || ejectMessage){
                    parameter.emit('disconnected', reason) 
                    parameter.disconnect() 
                }
           
            })

            return method.apply(this,args)
        }     
    }
}