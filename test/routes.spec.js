const app = require('../src/app');
const store = require('../src/store');

describe("Routes do the things they're supposed to", () => {
  let dummyData;
  // this took some googling and then finally looking at the solution
  beforeEach('copy the bookmarks', () => {
    dummyData = store.bookmarks;
  });
  afterEach('restore the bookmarks', () => {
    store.bookmarks = dummyData;
  });
  // 401s
  describe('401s without auth', () => {
    it('401 without auth on GET/bookmarks', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(401);
    });
    it('401 on GET/bookmarks/:id', () => {
      return supertest(app)
        .get(`/bookmarks/${store.bookmarks[0].id}`)
        .expect(401);
    });
    it('401 on POST/bookmarks', () => {
      return supertest(app)
        .post('/bookmarks')
        .send({ title: 'test-title', url: 'http://something.com', rating: 1 })
        .expect(401);
    });
    it('401 on DELETE/bookmarks/:id', () => {
      return supertest(app)
        .delete(`/bookmarks/${store.bookmarks[0].id}`)
        .expect(401);
    });
  });
  // 404s
  describe('404s when target does not exist', () => {
    it('GET', () => {
      return supertest(app)
        .get('/bookmarks/not-a-bookmark')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(404);
    });
    it('DELETE', () => {
      return supertest(app)
        .delete('/bookmarks/not-a-bookmark')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(404);
    });
    // it('PATCH', () => {
    //   return supertest(app)
    //     .patch(`/bookmarks/not-a-valid-id`)
    //     .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //     .expect(404);
    // });
  });
  // 200s
  describe('200s with auth', () => {
    it('GETs /bookmarks', () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200);
    });
    it('GET /bookmarks/:id works', () => {
      return supertest(app)
        .get(`/bookmarks/${store.bookmarks[1].id}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200);
    });
    it('POST /bookmarks/:id works', () => {
      const testMark = {
        title: 'test-title',
        url: 'https://test.com',
        rating: 1,
        description: 'test desc',
      };
      return supertest(app)
        .post('/bookmarks/')
        .send(testMark)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201);
    });
    it('DELETE /bookmarks/:id works', () => {
      const target = store.bookmarks[0];
      const expected = store.bookmarks.filter(item => item.id !== target.id);
      return supertest(app)
        .delete(`/bookmarks/${target.id}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(204)
        .then(() => {
          expect(store.bookmarks).eql(expected);
        });
    });
    // giving up on this for now
    // it('PUT /bookmarks/:id', () => {
    //   const target = store.bookmarks[0];
    //   return supertest(app)
    //     .put(`/bookmarks/${target.id}`)
    //     .send({ url: 'https://patched.com' })
    //     .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //     .expect(204)
    //     .then(() => {
    //       expect(store.bookmarks[0].url).eql('https://patched.com');
    //     });
    // });
  });
});
