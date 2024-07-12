const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { create } = require('domain')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Juno Juno',
        username: 'Juno Wong',
        password: '123123123'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Testing 2',
        username: 'Testing2',
        password: '123123123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible()
    await expect(page.getByText("username:")).toBeVisible()
    await expect(page.getByText("password:")).toBeVisible()
    const button_locator = page.getByRole('button', { name: 'login' })
    await expect(button_locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Juno Wong', '123123123')
  
      await expect(page.getByText('Juno Wong logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Juno Wong', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(page.getByText('Juno Wong logged in')).not.toBeVisible()
    }) 
  })

  describe('When logged in', () => {
    beforeEach(async({ page }) => {
      await loginWith(page, 'Juno Wong', '123123123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Blog 1 for testing', 'Billie', 'www.billie.com' )
      await expect (page.getByTestId('toggleShowBlog 1 for testing')).toContainText('Blog 1 for testing by Billie')
    })

    test('blog can be liked when more blogs are created', async( { page }) => {
      await createBlog(page, 'Blog 1 for testing', 'Billie', 'www.billie.com' )
      await createBlog(page, 'Blog 2 Happy Birthday', 'Christy' , 'www.christy.com')
      await page.getByTestId('viewBlog 2 Happy Birthday').click()
      await page.getByTestId('likeBlog 2 Happy Birthday').click()
      const check = await page.getByTestId('likeFieldBlog 2 Happy Birthday')
      await expect(check).toContainText('1') 
    })

    test('blog can be deleted', async({ page }) => {
      await createBlog(page, 'Blog 1 for testing', 'Billie', 'www.billie.com' )
      await expect (page.getByTestId('toggleShowBlog 1 for testing')).toContainText('Blog 1 for testing by Billie')
      await createBlog(page, 'Blog 2 Happy Birthday', 'Christy' , 'www.christy.com')
      await page.getByTestId('viewBlog 2 Happy Birthday').click()
      
      page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('confirm')
        console.log(dialog.message())
        await dialog.accept()
      })
      await page.getByTestId('removeBlog 2 Happy Birthday').click()
      await expect (page.getByTestId('toggleShowBlog 2 Happy Birthday')).toHaveCount(0)
    })

    test('remove button only shown by same user', async({ page }) => {
      await createBlog(page, 'Blog 1 for testing', 'Billie', 'www.billie.com' )
      await expect (page.getByTestId('toggleShowBlog 1 for testing')).toContainText('Blog 1 for testing by Billie')
      await createBlog(page, 'Blog 2 Happy Birthday', 'Christy' , 'www.christy.com')
      await expect (page.getByTestId('toggleShowBlog 2 Happy Birthday')).toContainText('Blog 2 Happy Birthday')

      await page.getByRole('button', { name: 'logout' }).click()
     
      await loginWith(page, 'Testing2', '123123123')

      await page.getByTestId('viewBlog 2 Happy Birthday').click()
      await expect (page.getByTestId('removeShowBlog 2 Happy Birthday')).toHaveCount(0)
    })

    test('whether the blogs are sorted', async({ page }) => {
      await createBlog(page, 'Blog 1 for testing', 'Billie', 'www.billie.com' )
      await expect (page.getByTestId('toggleShowBlog 1 for testing')).toContainText('Blog 1 for testing by Billie')
      await createBlog(page, 'Blog 2 Happy Birthday', 'Christy' , 'www.christy.com')
      await expect (page.getByTestId('toggleShowBlog 2 Happy Birthday')).toContainText('Blog 2 Happy Birthday')
      await createBlog(page, 'Blog 3', 'Sad Bear' , 'www.christy.com')
      await expect (page.getByTestId('toggleShowBlog 3')).toContainText('Blog 3')
      await page.getByTestId('viewBlog 2 Happy Birthday').click()
      await page.getByTestId('likeBlog 2 Happy Birthday').click()
      await expect(page.getByTestId('likeFieldBlog 2 Happy Birthday')).toContainText('1') 
      await page.getByTestId('likeBlog 2 Happy Birthday').click()
      await expect(page.getByTestId('likeFieldBlog 2 Happy Birthday')).toContainText('2') 
      await page.getByTestId('viewBlog 3').click()
      await page.getByTestId('likeBlog 3').click()
      await expect(page.getByTestId('likeFieldBlog 3')).toContainText('1') 
      const likeList = (await page.locator('.likeField').allInnerTexts())
      console.log(likeList)
      const sortedLike = likeList.sort((a, b) => b-a )
      console.log(sortedLike)
      expect(likeList).toEqual((sortedLike))
    })


  })

})

