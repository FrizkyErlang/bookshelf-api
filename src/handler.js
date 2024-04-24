const { nanoid } = require('nanoid');
const books = require('./books');

// handler untuk input buku
exports.addBookHandler = (req, h) => {
  // ambil semua body dari payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  // parse data
  const pageCountInt = parseInt(pageCount, 10);
  const readPageInt = parseInt(readPage, 10);

  // kalau tidak ada nama di body
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // kalau readPage > pageCount
  if (readPageInt > pageCountInt) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // melengkapi objek buku
  const id = nanoid(16);
  const finished = pageCountInt === readPageInt;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // deklarasi data buku baru
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  // mengecek apakah berhasil
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// handler untuk ambil semua data buku
exports.getAllBookHandler = (req, h) => {
  // mengambil query
  let { name, reading, finished } = req.query;

  // inisialisasi nilai awal buku
  let bookData = books;

  // filter buku berdasarkan query
  if (name) {
    name = name.toLowerCase();
    bookData = bookData.filter((book) => {
      const bookName = book.name.toLowerCase();
      return bookName.includes(name);
    });
  }
  if (reading) {
    reading = reading !== '0';
    bookData = bookData.filter((book) => book.reading === reading);
  }
  if (finished) {
    finished = finished !== '0';
    bookData = bookData.filter((book) => book.finished === finished);
  }

  bookData = bookData.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: { books: bookData },
  });

  response.code(200);
  return response;
};

// handler untuk mengambil detail buku berdasarkan id buku
exports.getBookByIdHandler = (req, h) => {
  // mengambil id buku dari params url
  const { id } = req.params;

  // mengambil buku yang sesuai id buku
  const bookData = books.filter((bookEl) => bookEl.id === id)[0];

  // mengirim response
  if (bookData !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: bookData,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler untuk menghapus berdasarkan id buku
exports.deleteBookByIdHandler = (req, h) => {
  // mengambil id buku dari params url
  const { id } = req.params;

  // mengambil indexbuku yang sesuai id buku
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    // menghapus buku sesuai index
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

exports.editBookByIdHandler = (req, h) => {
  // mengambil id buku dari params url
  const { id } = req.params;

  // ambil semua body dari payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  // parse data
  const pageCountInt = parseInt(pageCount, 10);
  const readPageInt = parseInt(readPage, 10);

  // kalau tidak ada nama di body
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // kalau readPage > pageCount
  if (readPageInt > pageCountInt) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // melengkapi objek buku
  const finished = pageCountInt === readPageInt;
  const updatedAt = new Date().toISOString();

  // mengambil indexbuku yang sesuai id buku
  const index = books.findIndex((book) => book.id === id);

  // edit book-nya
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
