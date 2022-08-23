const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");
const { NotAllowed } = require("../../lib/error-handling");
const compareNumber = require("../../utils/compare-number");
exports.ExerciseSuggestion = class ExerciseSuggestion extends Service {
  setup(app) {
    this.app = app;
  }

  async get(id, params) {
    try {
      const { user_ranking, assignment_id } = params.query;

      const [exerciseSuggestion, userScore] = await Promise.all([
        super.get(id, params),
        this.app.service("user-ranking").Model.findById(user_ranking), //find by id
      ]);

      if (
        compareNumber(
          userScore.score,
          exerciseSuggestion.minus_score,
          "lessEqual"
        )
      ) {
        return new NotAllowed("Bạn không đủ điểm để thực hiện");
      }

      await Promise.all([
        this.app.service("user-ranking").Model.findByIdAndUpdate(user_ranking, {
          $inc: { score: -exerciseSuggestion.minus_score },
        }),
        this.app
          .service("assignment-submit")
          .Model.findByIdAndUpdate(assignment_id, {
            $inc: {
              highest_score: -exerciseSuggestion.minus_score,
              suggestion_step: 1,
            },
          }),
      ]);

      return exerciseSuggestion;
    } catch (error) {
      return new GeneralError(
        error?.message ||
          "Xảy ra lỗi hệ thống - Server - Get - ExerciseSuggestion"
      );
    }
  }
};
