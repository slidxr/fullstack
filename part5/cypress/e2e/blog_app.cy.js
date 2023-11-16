describe('Bloglist app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Test User',
            username: 'test_user',
            password: 'test'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
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
        })
    })
})