const handler = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: handler.addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: handler.getAllBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: handler.getBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: handler.deleteBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: handler.editBookByIdHandler,
  },
];

module.exports = routes;
