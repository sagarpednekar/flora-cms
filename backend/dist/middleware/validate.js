"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: err.flatten().fieldErrors,
                });
            }
            next(err);
        }
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        try {
            req.query = schema.parse(req.query);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: err.flatten().fieldErrors,
                });
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map