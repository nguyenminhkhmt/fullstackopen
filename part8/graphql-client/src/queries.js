import { gql } from "@apollo/client"

export const AUTHOR_DETAILS = gql`
fragment AuthorDetails on Author {
  id
  name
  born
  bookCount
}
`

export const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  author {
    ...AuthorDetails
  }
  genres
  published
}
${AUTHOR_DETAILS}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
query AllBooks($genre: String, $author: String) {
  allBooks(genre: $genre, author: $author) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
mutation Mutation($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ALL_GENRES = gql`
query Query {
  allGenres
}
`

export const ME = gql`
query Me {
  me {
    username
    favouriteGenre
    id
  }
}
`

export const BOOK_ADDED = gql`
subscription Subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`