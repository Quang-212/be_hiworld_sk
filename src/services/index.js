const users = require('./users/users.service.js')
const upload = require('./upload/upload.service.js');
const role = require('./role/role.service.js');
const mailer = require('./mailer/mailer.service.js');
const refreshToken = require('./refresh-token/refresh-token.service.js');
const lessonCategory = require('./lesson-category/lesson-category.service.js');
const lesson = require('./lesson/lesson.service.js');
const friendship = require('./friendship/friendship.service.js');
const courseMeta = require('./course-meta/course-meta.service.js');
const courseList = require('./course-list/course-list.service.js');
const courseComment = require('./course-comment/course-comment.service.js');
const courseCategory = require('./course-category/course-category.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users)
  app.configure(upload);
  app.configure(role);
  app.configure(mailer);
  app.configure(refreshToken);
  app.configure(lessonCategory);
  app.configure(lesson);
  app.configure(friendship);
  app.configure(courseMeta);
  app.configure(courseList);
  app.configure(courseComment);
  app.configure(courseCategory);
}
