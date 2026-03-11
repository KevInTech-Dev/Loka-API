export interface BaseMapper<E, R> {
    toResponse(entity: E): R;
    toEntity(data: any): Partial<E>;
}