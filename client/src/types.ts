export interface IColumn {
    _id: string
    username: string
    title: string
    cards: string[]
}

export interface ICard {
    _id: string
    username: string
    columnId: string
    title: string
    content: string
    color: string
    createdAt: Date
    finishedAt: number
    comments: string[]
}

export interface IComment {
    _id: string
    username: string
    cardId: string
    content: string
    createdAt: Date
}