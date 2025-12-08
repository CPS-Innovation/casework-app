export type TDeletion = { id: string; pageNumber: number; isDeleted: boolean };

export type TIndexedDeletion = { [k: number]: TDeletion };
