import type { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import type { PaginatedResult, PaginationDto } from './pagination.dto';

export async function paginate<T extends ObjectLiteral>(
  repo: Repository<T>,
  paginationDto: PaginationDto,
  options?: FindManyOptions<T>,
): Promise<PaginatedResult<T>> {
  const { page, limit } = paginationDto;
  const skip = (page - 1) * limit;

  const [data, total] = await repo.findAndCount({
    ...options,
    skip,
    take: limit,
  });

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit) || 1,
      limit,
    },
  };
}
