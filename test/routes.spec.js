const app = require('../src/app');
const store = require('../src/store');

describe("Routes do the things they're supposed to", () => {
  let dummyData;
  beforeEach('copy the bookmarks', () => {
    // copy the bookmarks so we can restore them after testing
    dummyData = store.bookmarks.slice();
  });

  afterEach('restore the bookmarks', () => {
    // restore the bookmarks back to original
    store.bookmarks = dummyData;
  });
  // 401s
  describe('401 without auth', () => {
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
  // 200s
  describe('200 with auth', () => {
    it('GETs /bookmarks', () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200);
    });
    it('GETs /bookmarks/:id', () => {
      return supertest(app)
        .get(`/bookmarks/${store.bookmarks[1].id}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200);
    });
    it('DELETEs /bookmarks/:id', () => {
      const target = store.bookmarks[0];
      return supertest(app)
        .delete(`/bookmarks/${target.id}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(204);
      // .then((expected = delete dummyData[0]) => {
      //   expect(store.bookmarks).eql(expected);
      // });
    });
  });
});
