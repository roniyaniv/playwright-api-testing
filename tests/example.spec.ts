import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('get tags basic test', async ({ request }) => {
  const response = await request.get('/api/tags');
  const responseJSON = await response.json();
  // console.log(responseJSON);
  expect(response.status()).toBe(200);
  expect(responseJSON.tags[0]).toEqual('Test');
  expect(responseJSON.tags.length <= 10)
});

test('get articles basic test', async ({ request }) => {
  const response = await request.get('/api/articles?limit=10&offset=0');
  const responseJSON = await response.json();
  // console.log(responseJSON);
  expect(response.status()).toBe(200);
  expect(responseJSON.articles.length).toBeLessThanOrEqual(10);

});

test('Create article', async ({ request }) => {
  const tokenResponse = await request.post('/api/users/login', {
    data: { "user": { "email": process.env.TEST_USER_EMAIL, "password": process.env.TEST_USER_PASSWORD } }
  })

  const tokenResponseJSON = await tokenResponse.json();
  const token = tokenResponseJSON.user.token;

  // console.log(token);

  const articleTitle = faker.lorem.sentence()
  const newArticleResponse = await request.post('/api/articles', {
    data: {
      "article": {
        "title": articleTitle,
        "description": faker.lorem.paragraph(),
        "body": faker.lorem.paragraphs({ min: 1, max: 5 }),
        "tagList": faker.lorem.words({ min: 1, max: 3 }).split(' ') // tagList expects an array
      }
    },
    headers: {
      Authorization: `Token ${token}`
    }
  })

  expect(newArticleResponse.status()).toEqual(201)

  const newArticleResponseJSON = await newArticleResponse.json()
  expect(newArticleResponseJSON.article.title).toEqual(articleTitle)

  // console.log(newArticleResponseJSON);

})

test('Delete article', async ({request}) => {

  // create an article for deletion
  const tokenResponse = await request.post('/api/users/login', {
    data: { "user": { "email": process.env.TEST_USER_EMAIL, "password": process.env.TEST_USER_PASSWORD } }
  })

  const tokenResponseJSON = await tokenResponse.json();
  const token = tokenResponseJSON.user.token;

  // console.log(token);

  const articleTitle = faker.lorem.sentence()
  const newArticleResponse = await request.post('/api/articles', {
    data: {
      "article": {
        "title": articleTitle,
        "description": faker.lorem.paragraph(),
        "body": faker.lorem.paragraphs({ min: 1, max: 5 }),
        "tagList": faker.lorem.words({ min: 1, max: 3 }).split(' ') // tagList expects an array
      }
    },
    headers: {
      Authorization: `Token ${token}`
    }
  })

  // expect(newArticleResponse.status()).toEqual(201)

  const newArticleResponseJSON = await newArticleResponse.json()
  const slug = newArticleResponseJSON.article.slug

  // expect(newArticleResponseJSON.article.title).toEqual(articleTitle)

  // console.log(newArticleResponseJSON);

  const deleteArticleResponse = await request.delete(`/api/articles/${slug}`, {
    headers: {
      Authorization: `Token ${token}`
    }  
  })

  expect(deleteArticleResponse.status()).toEqual(204)
})