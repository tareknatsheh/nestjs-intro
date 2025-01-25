import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        if (data) {
            // example: `@GetUser('email') email: string`
            return request.user[data];
        }
        return request.user; // this 'user' object is set in the JwtStrategy automatically
    },
);
