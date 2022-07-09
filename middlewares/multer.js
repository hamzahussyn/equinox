const multer = require('multer');

const MimeTypes = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
};

const MimeTypesExtensions = {
  [MimeTypes.pdf]: '.pdf',
  [MimeTypes.doc]: '.doc',
  [MimeTypes.docx]: '.docx',
  [MimeTypes.jpeg]: '.jpeg',
  [MimeTypes.jpg]: '.jpg',
  [MimeTypes.png]: '.png',
};

const DocumentTypes = {
  IMAGES: 'images',
  DOCS: 'docs'
};

const DocumentTypeFilters = {
  [DocumentTypes.IMAGES]: imageFilter,
  [DocumentTypes.DOCS]: documentFilter
};

function imageFilter(req, file, cb) {
  if (file.mimetype === MimeTypes.jpeg || file.mimetype === MimeTypes.jpg || file.mimetype === MimeTypes.png) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

function documentFilter(req, file, cb) {
  if (file.mimetype === MimeTypes.doc || file.mimetype === MimeTypes.docx || file.mimetype === MimeTypes.pdf) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

function formData(directory = '', documentType) {
  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./assets/${directory}`);
    },
    filename: (req, file, cb) => {
      const mimetype = Object.keys(MimeTypes).find(key => MimeTypes[key] === file.mimetype);
      cb(null, Date.now() + MimeTypesExtensions[MimeTypes[mimetype]]);
    },
  });

  const upload = multer({
    storage: fileStorageEngine,
    fileFilter: DocumentTypeFilters[documentType],
  });
  return upload;
}

module.exports = {
  DocumentTypes,
  formData,
}