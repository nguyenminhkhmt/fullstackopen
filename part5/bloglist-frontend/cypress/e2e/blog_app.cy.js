describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    const user = {
      name: 'Duc Minh Nguyen',
      username: 'minhnd01',
      password: '12345678'
    }
    const user2 = {
      name: 'Michael R',
      username: 'michael01',
      password: '12345678'
    }
    cy.request('POST', 'http://localhost:3000/api/users/', user)
    cy.request('POST', 'http://localhost:3000/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('login').click()
    cy.get('#username').type('minhnd01')
    cy.get('#password').type('12345678')
    cy.get('#login-button').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.login({ username: 'minhnd01', password: '12345678' })
      cy.get('html').should('contain', 'Duc Minh Nguyen logged-in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('minhnd01')
      cy.get('#password').type('111111')
      cy.get('#login-button').click()

      // Check message is red!
      cy.get('.message').should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Duc Minh Nguyen logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'minhnd01', password: '12345678' })
    })

    it('A blog can be created', function () {
      cy.contains('create a new blog').click()
      cy.get('#blog-title').type('a blog title created by cypress')
      cy.get('#blog-author').type('MM')
      cy.get('#blog-url').type('abc.com')
      cy.get('#blog-create').click()
      cy.contains('a blog title created by cypress by MM')
    })

    describe('and user can interract with a blog', function () {
      beforeEach(function () {
        const blog = {
          title: 'another blog title created by cypress',
          author: 'MM',
          url: 'abcd.com',
          likes: 0
        }
        cy.createBlog({ blog: blog })
      })

      it('it can be liked', function () {
        cy.contains('another blog title created by cypress by MM')
          .contains('view').click()
        cy.get('#blog-like').click()
        cy.get('html').should('contain', 'likes 1')
      })

      it('it can be deleted', function () {
        cy.contains('another blog title created by cypress by MM')
          .contains('view').click()
        cy.get('#blog-delete').click()
        cy.get('html').should('contain', 'another blog title created by cypress is deleted!')
      })

      it('it can\'t be deleted without owner', function () {
        cy.login({ username: 'michael01', password: '12345678' })
        cy.contains('another blog title created by cypress by MM')
          .contains('view').click()
        cy.get('#blog-delete').click()
        cy.get('html').should('contain', 'another blog title created by cypress')
        cy.get('html').should('contain', 'Request failed')
      })

      it('blogs are ordered according to likes', function () {
        const blog = {
          title: 'The title with the second most likes',
          author: 'MM',
          url: 'abcd.com',
          likes: 10
        }
        const blog1 = {
          title: 'The title with the most likes',
          author: 'MM',
          url: 'abcd.com',
          likes: 20
        }
        cy.createBlog({ blog: blog })
        cy.createBlog({ blog: blog1 })

        cy.get('.blog').eq(0).should('contain', 'The title with the most likes by MM')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes by MM')
      })
    })
  })
})