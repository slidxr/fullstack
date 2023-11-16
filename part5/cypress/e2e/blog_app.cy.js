describe('Bloglist app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Test User',
            username: 'test_user',
            password: 'test'
        }
        const user2 = {
            name: 'Test User2',
            username: 'test_user_two',
            password: 'test2'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.request('POST', 'http://localhost:3001/api/users/', user2)
        cy.visit('http://localhost:5173')
    })

    it('Login form is shown', function() {
        cy.contains('Log in to application')
        cy.contains('username')
        cy.contains('password')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('test_user')
            cy.get('#password').type('test')
            cy.get('#login-button').click()
            cy.contains('Test User logged in')
        })

        it('login fails with wrong password', function() {
            cy.contains('login').click()
            cy.get('#username').type('test_user')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.contains('Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })
    describe('When logged in', function() {
        beforeEach(function() {
            cy.get('#username').type('test_user')
            cy.get('#password').type('test')
            cy.get('#login-button').click()
            cy.contains('Test User logged in')
        })

        it('A blog can be created', function() {
            cy.contains('create').click()
            cy.get('#title').type('test title')
            cy.get('#author').type('test author')
            cy.get('#url').type('http://testurl.com')
            cy.get('#create-button').click({ force: true })
            cy.contains('test title test author')
        })
        describe('blog exists', function () {
            beforeEach(function () {
                cy.contains('create').click()
                cy.get('#title').type('test title')
                cy.get('#author').type('test author')
                cy.get('#url').type('http://testurl.com')
                cy.get('#create-button').click({ force: true })
                cy.contains('test title test author')
            })

            it('user can add likes', function () {
                cy.contains('view').click()
                cy.contains('0')
                    .contains('like')
                    .click()
                cy.contains('1')
            })
            it('user can delete their blogs', function () {
                cy.contains('view').click()
                cy.get('#remove-button').click()
                cy.contains('remove').should('not.exist')
            })

            describe('Second User', function () {
                beforeEach(function () {
                    cy.contains('logout').click()
                    cy.get('#username').type('test_user_two')
                    cy.get('#password').type('test2')
                    cy.get('#login-button').click()
                    cy.contains('Test User2 logged in')
                })

                it('only user who created the blog can delete it', function () {
                    cy.contains('create').click()
                    cy.get('#title').type('test title two')
                    cy.get('#author').type('test author two')
                    cy.get('#url').type('http://testurltwo.com')
                    cy.get('#create-button').click({ force: true })
                    cy.contains('test title two test author two')
                    cy.contains('logout').click()
                    cy.get('#username').type('test_user')
                    cy.get('#password').type('test')
                    cy.get('#login-button').click()
                    cy.contains('Test User logged in')
                    cy.contains('view').click()
                    cy.contains('remove').should('not.exist')
                })
                it.only('blogs are ordered by likes', function () {
                    cy.contains('create').click()
                    cy.get('#title').type('The title with most likes')
                    cy.get('#author').type('mostlikes')
                    cy.get('#url').type('https://www.mostlikes.com')
                    cy.get('#create-button').click({ force: true })

                    cy.contains('The title with most likes').contains('view').click()
                    cy.get('.shownBlog').find('button#like-button').eq(1).should('be.visible').click()

                    cy.get('.blog').eq(0).should('contain', 'The title with most likes')
                    cy.get('.blog').eq(-1).should('contain', 'test title')
                })
            })
        })
    })
})