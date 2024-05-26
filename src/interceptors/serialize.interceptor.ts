import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {

    }
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
        // code here will run before request handler (controller) starts its execution

        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }        
}