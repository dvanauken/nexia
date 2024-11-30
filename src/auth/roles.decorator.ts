
// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from './roles/role.enum';  // Fix the import path

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

