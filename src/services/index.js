const users = require("./users/users.service.js");
const upload = require("./upload/upload.service.js");
const role = require("./role/role.service.js");
const mailer = require("./mailer/mailer.service.js");
const refreshToken = require("./refresh-token/refresh-token.service.js");
const lessonCategory = require("./lesson-category/lesson-category.service.js");
const lesson = require("./lesson/lesson.service.js");
const friendship = require("./friendship/friendship.service.js");
const courseList = require("./course-list/course-list.service.js");
const courseCategory = require("./course-category/course-category.service.js");
const userInfo = require("./user-info/user-info.service.js");
const courseFeedback = require("./course-feedback/course-feedback.service.js");
const exercise = require("./exercise/exercise.service.js");
const userCourse = require("./user-course/user-course.service.js");
const lessonComment = require("./lesson-comment/lesson-comment.service.js");
const lessonExercise = require("./lesson-exercise/lesson-exercise.service.js");
const userFollow = require("./user-follow/user-follow.service.js");
const userRanking = require("./user-ranking/user-ranking.service.js");
const assignmentSubmit = require("./assignment-submit/assignment-submit.service.js");
const assignmentComment = require("./assignment-comment/assignment-comment.service.js");
const userCoursePosition = require("./user-course-position/user-course-position.service.js");
const userRoom = require("./user-room/user-room.service.js");
const assignmentContract = require("./assignment-contract/assignment-contract.service.js");
const userNotification = require("./user-notification/user-notification.service.js");
const assignmentChat = require("./assignment-chat/assignment-chat.service.js");
const chatTyping = require("./chat-typing/chat-typing.service.js");
const joinRoom = require("./join-room/join-room.service.js");
const exerciseSuggestion = require("./exercise-suggestion/exercise-suggestion.service.js");
const contractReport = require("./contract-report/contract-report.service.js");
const scoreHistory = require("./score-history/score-history.service.js");
const calling = require('./calling/calling.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(upload);
  app.configure(role);
  app.configure(mailer);
  app.configure(refreshToken);
  app.configure(lessonCategory);
  app.configure(lesson);
  app.configure(exercise);
  app.configure(courseList);
  app.configure(courseCategory);
  app.configure(friendship);
  app.configure(userInfo);
  app.configure(courseFeedback);
  app.configure(userCourse);
  app.configure(lessonComment);
  app.configure(lessonExercise);
  app.configure(userFollow);
  app.configure(userRanking);
  app.configure(assignmentSubmit);
  app.configure(assignmentComment);
  app.configure(userCoursePosition);
  app.configure(userRoom);
  app.configure(assignmentContract);
  app.configure(userNotification);
  app.configure(assignmentChat);
  app.configure(chatTyping);
  app.configure(joinRoom);
  app.configure(exerciseSuggestion);
  app.configure(contractReport);
  app.configure(scoreHistory);
  app.configure(calling);
};
