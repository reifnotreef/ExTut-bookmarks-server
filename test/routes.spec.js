// const app = require('../src/app');
const BookmarkServices = require('../src/bookmark-services');
const knex = require('knex');
// const store = require('../src/store');

describe("Routes do the things they're supposed to", () => {
  let db;
  before = () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  };
  let testItems = [
    {
      id: 1,
      title: 'site one',
      url: 'siteone.com',
      description: 'first site',
      rating: 1,
    },
    {
      id: 2,
      title: 'site second',
      url: 'sitesecond.com',
      description: 'second site',
      rating: 2,
    },
    {
      id: 3,
      title: 'site third',
      url: 'sitethird.com',
      description: 'third site',
      rating: 3,
    },
    {
      id: 4,
      title: 'site four',
      url: 'sitefour.com',
      description: 'fourth site',
      rating: 4,
    },
  ];
  before(() => db('bookmarks').truncate());

  afterEach(() => db('bookmarks').truncate());

  after(() => db.destroy());
  // db is empty
  it('getAll() returns [] with no data in db', () => {
    const expectedItems = [];
    db('bookmarks').truncate();
    return BookmarkServices.getAll(db).then(actual => {
      expect(actual).eql(expectedItems);
    });
  });
  it('successfully posts new inserts new item', () => {
    const expectedItem = {
      id: 99,
      title: 'site 99',
      url: 'site99.com',
      description: '99th site',
      rating: 5,
    };
    return BookmarkServices.insertItem(db, expectedItem).then(actual =>
      expect(actual).eql(expectedItem)
    );
  });
  it('gets bookmark by id', () => {
    expectedItem = {
      id: 1,
      title: 'site one',
      url: 'siteone.com',
      description: 'first site',
      rating: 1,
    };
    return BookmarkServices.insertItem(db, expectedItem).then(() => {
      return BookmarkServices.getById(db, expectedItem.id).then(result => {
        expect(result).eql(expectedItem);
      });
    });
  });
  // // 401s
  // describe('401s without auth', () => {
  //   it('401 without auth on GET/bookmarks', () => {
  //     return supertest(app)
  //       .get('/bookmarks')
  //       .expect(401);
  //   });
  //   it('401 on GET/bookmarks/:id', () => {
  //     return supertest(app)
  //       .get(`/bookmarks/${store.bookmarks[0].id}`)
  //       .expect(401);
  //   });
  //   it('401 on POST/bookmarks', () => {
  //     return supertest(app)
  //       .post('/bookmarks')
  //       .send({ title: 'test-title', url: 'http://something.com', rating: 1 })
  //       .expect(401);
  //   });
  //   it('401 on DELETE/bookmarks/:id', () => {
  //     return supertest(app)
  //       .delete(`/bookmarks/${store.bookmarks[0].id}`)
  //       .expect(401);
  //   });
  //   it('401 on POST/bookmarks/:id/edit', () => {
  //     const target = store.bookmarks[0];
  //     return supertest(app)
  //       .post(`/bookmarks/${target.id}/edit`)
  //       .send({ url: 'https://patched.com' })
  //       .expect(401);
  //   });
  // });
  // // 404s
  // describe('404s when target does not exist', () => {
  //   it('GET', () => {
  //     return supertest(app)
  //       .get('/bookmarks/not-a-bookmark')
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .expect(404);
  //   });
  //   it('DELETE', () => {
  //     return supertest(app)
  //       .delete('/bookmarks/not-a-bookmark')
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .expect(404);
  //   });
  // });
  // // 500s
  // describe('500s when target does not exist', () => {
  //   it('POST', () => {
  //     return supertest(app)
  //       .post(`/bookmarks/000000/edit`)
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .send({ url: 'https://patched.com' })
  //       .expect(500);
  //   });
  // });
  // 200s
  // describe('200s with auth', () => {
  //   it('GETs /bookmarks', () => {
  //     return supertest(app)
  //       .get('/bookmarks')
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .expect(200);
  //   });
  //   it('GET /bookmarks/:id works', () => {
  //     return supertest(app)
  //       .get(`/bookmarks/${store.bookmarks[1].id}`)
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .expect(200);
  //   });
  //   it('POST /bookmarks/:id works', () => {
  //     const testMark = {
  //       title: 'test-title',
  //       url: 'https://test.com',
  //       rating: 1,
  //       description: 'test desc',
  //     };
  //     return supertest(app)
  //       .post('/bookmarks/')
  //       .send(testMark)
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .expect(201);
  //   });
  //   it('DELETE /bookmarks/:id works', () => {
  //     const target = store.bookmarks[0];
  //     const expected = store.bookmarks.filter(item => item.id !== target.id);
  //     return supertest(app)
  //       .delete(`/bookmarks/${target.id}`)
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .expect(204)
  //       .then(() => {
  //         expect(store.bookmarks).eql(expected);
  //       });
  //   });
  //   it('POST /bookmarks/:id/edit works', () => {
  //     const target = store.bookmarks[0];
  //     return supertest(app)
  //       .post(`/bookmarks/${target.id}/edit`)
  //       .send({ url: 'https://patched.com' })
  //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //       .expect(200)
  //       .then(() => {
  //         expect(store.bookmarks[0].url).eql('https://patched.com');
  //       });
  //   });
  // });
});
