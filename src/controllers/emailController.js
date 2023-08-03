import ErrorResponse from "../middlewares/error/ErrorResponse.js";
import { create, update, remove, findAll, findById } from "../repositories/emailRepositories.js"
import { sendMail, verifyTime } from "../services/EmailingService.js";
import schedule from 'node-schedule';

const createEmail = async (req, res, next) => {
    const newEmail = res.locals.validData;
    try {
        await verifyTime(newEmail.scheduledAt);

        const savedEmail = await create(newEmail);
        const { _id, scheduledAt } = savedEmail;

        schedule.scheduleJob(_id.toString(), scheduledAt, async () => {
            try {
                const { toEmail, subject, text } = await findById(_id);
                await sendMail(toEmail, subject, text);
                await update(_id, { status: "sent" });
            } catch (sendMailError) {
                await update(_id, { status: "failed" });
            }
        });

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Your Email Is Successfully Scheduled!"
        });
    } catch (error) {
        if (error.isVerificationError) {
            return next(ErrorResponse.badRequest(error.message));
        } else {
            return next(ErrorResponse.internalError(error.message));
        }
    }
};


const listEmails = async (req, res, next) => {
    try {
        const options = {
            search: req.query.search || "",
            sort: req.query.sort || "latest",
            filter: req.query.filter || "all",
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
        }
        const scheduled = await findAll(options);
        if (!scheduled) {
            return next(ErrorResponse.notFound("No scheduled emails found"))
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: scheduled.totalCount > 0 ? "Emails successfully fetched" : "No emails to fetch",
            ...(scheduled.totalCount > 0 ? { totalCount: scheduled.totalCount, emails: scheduled.emails } : {}),
        });
    } catch (error) {
        return next(ErrorResponse.internalError(error.message));
    }
}

const readEmail = async (req, res, next) => {
    const id = req.params.id
    try {
        const scheduledEmail = await findById(id);
        if (!scheduledEmail) {
            return next(ErrorResponse.notFound("Scheduled email not found"));
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Your Scheduled Email has been Cancelled",
            scheduledEmail
        });
    } catch (error) {
        return next(ErrorResponse.internalError(error.message));
    }
}

const updateEmail = async (req, res, next) => {
    const id = req.params.id
    const emailToUpdate = res.locals.validData
    try {
        const updatedEmail = await update(id, emailToUpdate);
        if (!updatedEmail) {
            return next(ErrorResponse.notFound("No pending scheduled emails to update."))
        }

        if (emailToUpdate && emailToUpdate.scheduledAt !== undefined) {
            const rescheduled = schedule.rescheduleJob(updatedEmail._id.toString(), emailToUpdate.scheduledAt);
            if (!rescheduled) {
                return next(ErrorResponse.badRequest("Scheduled email cannot be update at this time. Try again later"));
            }
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Your Scheduled Email has been updated"
        });
    } catch (error) {
        return next(ErrorResponse.internalError(error.message));
    }
}

const deleteEmail = async (req, res, next) => {
    const id = req.params.id
    try {
        const email = await remove(id);
        if (!email) {
            return next(ErrorResponse.notFound("No pending or failed scheduled emails to delete."))
        }
        const cancelled = schedule.cancelJob(email._id.toString());

        if (cancelled) {
            return res.status(200).json({
                success: true,
                status: 200,
                message: "Your Scheduled Email has been Cancelled"
            });
        } else {
            return next(ErrorResponse.badRequest("Scheduled email cannot be canceled at this time. Try again later"));
        }
    } catch (error) {
        return next(ErrorResponse.internalError(error.message));
    }
}

export {
    createEmail,
    deleteEmail,
    listEmails,
    readEmail,
    updateEmail
}
