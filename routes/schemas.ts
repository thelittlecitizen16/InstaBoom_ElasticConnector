import Joi = require('joi');
import { Request, Response, NextFunction } from 'express';

const schemas = {
    blogPOST: Joi.object().keys({
        paging: Joi.object().keys({
            from: Joi.number().required(),
            size: Joi.number().required()
        }),
        fields: Joi.array().min(1).items(Joi.string()).required(),
        range: Joi.object().min(1).keys({
            date: Joi.object().min(1).keys({
                start: Joi.date(),
                end: Joi.date()
            })
        }),
        sort: Joi.object().min(1).keys({
            dateType: Joi.valid(...['createdAt ', 'updatedAt']),
            order: Joi.valid(...['desc', 'asc'])
        }),
        analytics: Joi.object().min(1).keys({
            hashedId: Joi.valid(...['have', 'notHave', 'ignore']),
            carRecognition: Joi.valid(...['have', 'notHave', 'ignore']),
            withLpr: Joi.valid(...['have', 'notHave', 'ignore']),
            withoutLpr: Joi.valid(...['have', 'notHave', 'ignore'])
        }),
        match: Joi.object().min(1).keys({
            sensorId: Joi.array().items(Joi.string()),
            cameraMode: Joi.array().items(Joi.valid(...['P1', 'P2', 'IR'])),
            hashedId: Joi.array().items(Joi.string()),
            lpr: Joi.array().items(Joi.string()),
            pictureId: Joi.array().items(Joi.string()),
            manufacturer: Joi.array().items(Joi.string()),
            model: Joi.array().items(Joi.string()),
            color: Joi.array().items(Joi.string()),
            year: Joi.array().items(Joi.string()),
        })
    })
};

const schemasMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schemas.blogPOST.validate(req.body)
        const valid = error == null
        if (valid) {
            next()
        } else {
            const errorsDetail = error?.details.map(i => i.message);
            res.status(400).json({
                status: false,
                error: errorsDetail
            })
        }
    }
}

export { schemasMiddleware }