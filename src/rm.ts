import { Config, DelayData, RateData } from "./types";

export default class rm {
    config: Config = {
        rule: {
            type: "delay",
            delay: 1000
        }
    }

    constructor(config: Config){
        this.config = config;
    }

    delayData: DelayData = {

    }

    rateData: RateData = {

    }

    /**
     * Check if the request is allowed according to the rate limit rules.
     * @param identifier The identifier of the request. Usually the IP address of the client or maybe a session.
     * @returns True if the request is allowed, false if not, true if yes.
     */
    check(identifier: string | number, record: boolean = true): boolean {
        if (this.config.rule.type === "delay") {
            if(!this.delayData[identifier]){
                if(record){
                    this.delayData[identifier] = Date.now()
                }
                return true;
            } else {
                const last: number = this.delayData[identifier];

                if(Date.now() - last > this.config.rule.delay){
                    if(record){
                        this.delayData[identifier] = Date.now();
                    }
                    return true;
                } else {
                    return false;
                }
            }
        }

        // Rate rule

        if(!this.rateData[identifier]){
            if (record){
                this.rateData[identifier] = {
                    startLocker: Date.now(),
                    endLocker: Date.now() + this.config.rule.period * 1000,
                    amount: 1
                }
            }
            return true;
        } else {
            const last: {
                startLocker: number,
                endLocker: number,
                amount: number
            } = this.rateData[identifier];

            if(Date.now() > last.endLocker){
                if(record){
                    this.rateData[identifier] = {
                        startLocker: Date.now(),
                        endLocker: Date.now() + this.config.rule.period * 1000,
                        amount: 1
                    }
                }
                return true;
            } else {
                if(last.amount + 1 > this.config.rule.amount){
                    return false;
                } else {
                    if(record){
                        this.rateData[identifier] = {
                            startLocker: last.startLocker,
                            endLocker: last.endLocker,
                            amount: last.amount + 1
                        }
                    }
                    return true;
                }
            }
        }
    }
}