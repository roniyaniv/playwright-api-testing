import { test, expect } from '@playwright/test';

test('get tags basic test', async ({ request }) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const responseJSON = await response.json();
  console.log(responseJSON);
  expect(response.status()).toBe(200);
  expect(responseJSON.tags[0]).toEqual('Test');
  expect(responseJSON.tags.length <= 10)
});

test('get articles basic test', async ({request}) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const responseJSON = await response.json();
  console.log(responseJSON);
  expect(response.status()).toBe(200);
  expect(responseJSON.articles.length).toBeLessThanOrEqual(10);

})

