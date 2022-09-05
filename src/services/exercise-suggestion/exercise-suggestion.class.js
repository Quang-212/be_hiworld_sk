const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");
const { NotAllowed } = require("../../lib/error-handling");
const compareNumber = require("../../utils/compare-number");
exports.ExerciseSuggestion = class ExerciseSuggestion extends Service {
  setup(app) {
    this.app = app;
  }

  // async get(id, params) {
  //   try {
  //     const { user_ranking_id, assignment_id } = params.query;

  //     const [suggestion, userScore] = await Promise.all([
  //       super.get(id, params),
  //       this.app.service("user-ranking").Model.findById(user_ranking_id),  //find by id
  //     ]);

  //     if (compareNumber(userScore.score, suggestion.minus_score, "lte")) {
  //       throw new NotAllowed("Bạn không đủ điểm để thực hiện");
  //     }

  //     await Promise.all([
  //       this.app
  //         .service("user-ranking")
  //         .Model.findByIdAndUpdate(user_ranking_id, {
  //           $inc: { score: -suggestion.minus_score },
  //         }),
  //       this.app
  //         .service("assignment-submit")
  //         .Model.findByIdAndUpdate(assignment_id, {
  //           $inc: {
  //             highest_score: -suggestion.minus_score,
  //             suggestion_step: 1,
  //           },
  //         }),
  //     ]);

  //     return suggestion;
  //   } catch (error) {
  //     return new GeneralError(
  //       error?.message ||
  //         "Xảy ra lỗi hệ thống - Server - Get - ExerciseSuggestion"
  //     );
  //   }
  // }
};
