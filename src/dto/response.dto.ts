export interface ResponseDto<T> {
    data: T,
    totalCount? : number
}