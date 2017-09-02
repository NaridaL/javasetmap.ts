export type int = number
export interface Equalable {
    equals(o: any): boolean

    hashCode(): int
}