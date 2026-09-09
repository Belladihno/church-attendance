import { QueryFailedError } from 'typeorm';

export interface PgUniqueError {
  code: string;
  constraint?: string;
  driverError?: PgUniqueError;
}

export const isPgUniqueViolation = (
  e: unknown,
  constraint: string,
): boolean => {
  if (!(e instanceof QueryFailedError)) return false;
  const err = e as unknown as PgUniqueError;
  const code = err.code ?? err.driverError?.code;
  const cons = err.constraint ?? err.driverError?.constraint;
  return code === '23505' && cons === constraint;
};
