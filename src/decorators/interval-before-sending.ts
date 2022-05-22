export function intervalBeforeSending(

    target: any,
    propertyKey: String,
    descriptor: PropertyDescriptor
)
    {
        const method = descriptor.value

        descriptor.value = function(...args: any[]){

            setTimeout(() => {
                return method.apply(this,args)
            }, 1500);
        }
   
    }

