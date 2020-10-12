
interface JsonSchema {
    "paging": { "from": number, "size": number },
    "fields": string[],
    "match"?: {
        "sensorId"?: string[], "cameraMode"?: string[],
        "hashedId"?: string[], "lpr"?: string[], "pictureId"?: string[],
        "carManufacturer"?: string[], "carModel"?: string[], "carColor"?: string[], "carYear"?: string[]
    },
    "range"?: { "date"?: { "start"?: string, "end"?: string } }
    "sort"?: { "dateType": string, "order": string }
    "analytics"?: { "hashedId": string, "carRecognition": string, "withLpr": string, "withoutLpr": string },
}

export { JsonSchema }