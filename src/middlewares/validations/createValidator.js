import Joi from "joi";
import ErrorResponse from "../error/ErrorResponse.js";

const createScheduleSchema = Joi.object({
    toEmail: Joi.string().email().required().messages({
        "string.base": "To email must be a string",
        "string.empty": "To email cannot be left empty",
        "string.email": "To email must be a valid email address",
        "any.required": "To email is required"
    }),
    subject: Joi.string().required().max(75).messages({
        "string.base": "Subject must be a string",
        "string.empty": "Subject cannot be left empty",
        "string.max": "Subject should not exceed 75 characters in length",
        "any.required": "Subject required for sending email"
    }),
    text: Joi.string().required().messages({
        "string.base": "Text must be a string",
        "string.empty": "Text cannot be left empty",
        "any.required": "Text required for sending email"
    }),
    scheduledAt: Joi.date().iso().required().messages({
        "date.base": "ScheduledAt must be a valid date",
        "date.format": "ScheduledAt must be in ISO date format",
        "any.required": "ScheduledAt field is required"
    })
});
const createScheduleValidation = (req, res, next) => {
    const { toEmail, subject, text, scheduledAt } = req.body;
    const { value: data, error } = createScheduleSchema.validate(
        { toEmail, subject, text, scheduledAt },
        { abortEarly: true },
    );
    if (error) {
        next(ErrorResponse.badRequest(error.message));
    } else {
        res.locals.validData = data;
        next();
    }
};

export default createScheduleValidation;