import Joi from "joi";
import ErrorResponse from "../error/ErrorResponse.js";

const updateScheduleSchema = Joi.object({
    toEmail: Joi.string().email().optional().messages({
        "string.base": "To email must be a string",
        "string.empty": "To email cannot be left empty",
        "string.email": "To email must be a valid email address",
    }),
    subject: Joi.string().max(75).optional().messages({
        "string.base": "Subject must be a string",
        "string.empty": "Subject cannot be left empty",
        "string.max": "Subject should not exceed 75 characters in length",
    }),
    text: Joi.string().optional().messages({
        "string.base": "Text must be a string",
        "string.empty": "Text cannot be left empty",
    }),
    scheduledAt: Joi.date().iso().optional().messages({
        "date.base": "ScheduledAt must be a valid date",
        "date.format": "ScheduledAt must be in ISO date format",
    })
});
const updateScheduleValidation = (req, res, next) => {
    const emailToUpdate = req.body;
    const { value: data, error } = updateScheduleSchema.validate(
        emailToUpdate,
        { abortEarly: true },
    );
    if (error) {
        next(ErrorResponse.badRequest(error.message));
    } else {
        res.locals.validData = data;
        next();
    }
};

export default updateScheduleValidation;