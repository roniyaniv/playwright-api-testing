import { faker } from '@faker-js/faker';
import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect'

let authToken: string

test.beforeAll('Run before all tests', async ({ api }) => {

  // Create an authToken

  const tokenResponse = await api
    .path('/users/login')
    .body({
      "user": { "email": process.env.TEST_USER_EMAIL, "password": process.env.TEST_USER_PASSWORD }
    })
    .postRequest(200)

  // console.log(tokenResponse);
  authToken = `Token ${tokenResponse.user.token}`;

})


test('Get articles', async ({ api }) => {

  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)

  expect(response.articles.length).toBeLessThanOrEqual(10);

  // console.log(response);
})

test('Get tags', async ({ api }) => {
  const response = await api
    .path('/tags')
    .getRequest(200)

  // console.log(responseJSON);
  expect(response.tags[0]).shouldEqual('Test');
  expect(response.tags.length <= 10)
});



test('Create and Delete article', async ({ api }) => {

  // create an article for deletion

  const articleTitle = faker.lorem.sentence()

  const newArticleResponse = await api
    .path('/articles')
    .body({
      "article": {
        "title": articleTitle,
        "description": faker.lorem.paragraph(),
        "body": faker.lorem.paragraphs({ min: 1, max: 5 }),
        "tagList": faker.lorem.words({ min: 1, max: 3 }).split(' ') // tagList expects an array
      }
    })
    .headers({ Authorization: authToken })
    .postRequest(201)

  expect(newArticleResponse.article.title).shouldEqual(articleTitle)
  const slug = newArticleResponse.article.slug

  // delete the article
  await api
    .path(`/articles/${slug}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204)

})

test('Create, Update and Delete article', async ({ api }) => {

  const articleTitle = faker.lorem.sentence()

  const newArticleResponse = await api
    .path('/articles')
    .body({
      "article": {
        "title": articleTitle,
        "description": faker.lorem.paragraph(),
        "body": faker.lorem.paragraphs({ min: 1, max: 5 }),
        "tagList": faker.lorem.words({ min: 1, max: 3 }).split(' ') // tagList expects an array
      }
    })
    .headers({ Authorization: authToken })
    .postRequest(201)

  const slugID = newArticleResponse.article.slug
  const tagList = newArticleResponse.article.tagList

  const updateArticleResponse = await api
    .path(`/articles/${slugID}`)
    .body({
      "article": {
        "slug": slugID,
        "title": faker.lorem.sentence(),
        "description": faker.lorem.paragraph(),
        "body": faker.lorem.paragraphs({ min: 1, max: 5 }),
        "tagList": tagList.push(faker.lorem.words({ min: 1, max: 3 }).split(' ')) // tagList expects an array
      }
    })
    .headers({ Authorization: authToken })
    .putRequest(200)

  const updatedSlugID = updateArticleResponse.article.slug
  expect(updatedSlugID).not.shouldEqual(slugID)

  // delete the article
  await api
    .path(`/articles/${updatedSlugID}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204)

})