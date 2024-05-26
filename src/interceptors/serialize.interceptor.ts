import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";
import { UserDTO } from "src/users/dtos/user.dto";

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
        // code here will run before request handler (controller) starts its execution

        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(UserDTO, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }        
}