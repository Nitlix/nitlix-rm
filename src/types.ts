type DelayRule = {
    type: "delay",
    /**
     * Delay in milliseconds
     */
    delay: number 
}

type RateRule = {
    type: "rate",
    /**
     * Amount of requests allowed in certain time period
     * @example 10
        */
    amount: number,
    /**
     * Time period in seconds
     * @example 30
        */
    period: number
}
    

export type Config = {
    rule: DelayRule | RateRule
}


export type DelayData = {
    [identifier: string | number]: number,
}

export type RateData = {
    [identifier: string | number]: {
        startLocker: number,
        endLocker: number,
        amount: number
    }
}

