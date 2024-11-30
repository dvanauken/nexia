// src/auth/roles/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles/role.enum';
import { ROLES_KEY } from './roles.decorator';

// src/auth/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

// roles.guard.ts
canActivate(context: ExecutionContext): boolean {
  console.log('RolesGuard canActivate called');
  const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  console.log('Required roles:', requiredRoles);
  if (!requiredRoles) {
    console.log('No roles required, allowing access');
    return true;
  }
  const { user } = context.switchToHttp().getRequest();
  console.log('User in guard:', user);
  const hasRole = requiredRoles.includes(user.role);
  console.log('Has required role:', hasRole);
  return hasRole;
}
}