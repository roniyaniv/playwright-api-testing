import { test } from '../utils/fixtures';
import { expect } from '@playwright/test'

test('Get articles', async ({ api }) => {

  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)

  expect(response.articles.length).toBeLessThanOrEqual(10);
    
  console.log(response);
})

test('get tags basic test', async ({ api }) => {
  const response = await api
    .path('/tags')
    .getRequest(200)
  
  // console.log(responseJSON);
  expect(response.tags[0]).toEqual('Test');
  expect(response.tags.length <= 10)
});
