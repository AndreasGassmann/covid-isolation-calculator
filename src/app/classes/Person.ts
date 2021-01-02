function addDays(date: Date, days: number) {
    var newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().padStart(2, '0')
    return `${day}.${month}.${year}`
}

function getDurationInDays(fromDate: Date, toDate: Date): number {
    const differenceInTime = toDate.getTime() - fromDate.getTime();
    return Math.round(differenceInTime / (1000 * 3600 * 24))
}

const ISOLATION_TIME: number = 10

export interface IsolationInfo {
    isolation: {
        start: string
        end: string
        duration: number,
        calculation: string,
        explanation: string
    },
    verfuegung: {
        start: string
        end: string
        duration: number,
        calculation: string,
        explanation: string
    }
}

export interface QuarantineInfo {
    normal: {
        start: string
        end: string
        duration: number,
        calculation: string,
        explanation: string
    }
    under12: {
        start: string
        end: string
        duration: number,
        calculation: string,
        explanation: string
    }
    over12: {
        start: string
        end: string
        duration: number,
        calculation: string,
        explanation: string
    }
}

export class Person {
    public name?: string
    public symptomsDate: Date
    public testDate: Date
    public resultDate: Date
    public isolationStartDate: Date

    constructor(name: string, symptoms: Date, test: Date, result: Date, isolationStart: Date) {
        this.name = name
        this.symptomsDate = new Date(symptoms)
        this.testDate = new Date(test)
        this.resultDate = new Date(result)
        this.isolationStartDate = new Date(isolationStart)
    }

    getInfectionStartDate() {
        return this.symptomsDate.getTime() > this.testDate.getTime() ? this.testDate : this.symptomsDate
    }

    public getIsolationEndDate() {
        const infectionStartDate = this.getInfectionStartDate()
        return addDays(infectionStartDate, ISOLATION_TIME)
    }

    public getInfos(): IsolationInfo {
        return {
            isolation: {
                start: formatDate(this.getInfectionStartDate()),
                end: formatDate(this.getIsolationEndDate()),
                duration: getDurationInDays(this.getInfectionStartDate(), this.getIsolationEndDate()),
                calculation: `Symptomstart (${formatDate(this.getInfectionStartDate())}) + ${ISOLATION_TIME} Tage = ${formatDate(this.getIsolationEndDate())}`,
                explanation: `Ab dem Symptomstart ${ISOLATION_TIME} Tage (inklusive letztem Tag). Falls keine Symptome vorhanden sind, wird das Testdatum genommen.`
            },
            verfuegung: {
                start: formatDate(this.isolationStartDate),
                end: formatDate(this.getIsolationEndDate()),
                duration: getDurationInDays(this.isolationStartDate, this.getIsolationEndDate()),
                calculation: 'string',
                explanation: 'string'
            }
        }
    }
}

export class House {
    static getRoommateInfo(person: Person): QuarantineInfo {
        const quarantineEnd = addDays(person.isolationStartDate, ISOLATION_TIME)
        const quarantineEndNoIsolation = addDays(person.getIsolationEndDate(), ISOLATION_TIME)
        return {
            normal: {
                start: formatDate(person.isolationStartDate),
                end: formatDate(quarantineEnd),
                duration: getDurationInDays(person.isolationStartDate, quarantineEnd),
                calculation: `${formatDate(person.isolationStartDate)} + ${ISOLATION_TIME} = ${formatDate(quarantineEnd)}`,
                explanation: `${ISOLATION_TIME} Tage nach letztem Kontakt mit infizierter Person.`
            },
            under12: {
                start: formatDate(person.getInfectionStartDate()),
                end: formatDate(person.getIsolationEndDate()),
                duration: getDurationInDays(person.getInfectionStartDate(), person.getIsolationEndDate()),
                calculation: `Gleichzeitig mit infizierter Person (${formatDate(person.getIsolationEndDate())})`,
                explanation: `Kinder unter 12 dürfen gleichzeitig mit der IP die Quarantäne verlassen.`
            },
            over12: {
                start: formatDate(person.getInfectionStartDate()),
                end: formatDate(quarantineEndNoIsolation),
                duration: getDurationInDays(person.getInfectionStartDate(), quarantineEndNoIsolation),
                calculation: `${formatDate(person.getIsolationEndDate())} + ${ISOLATION_TIME} = ${formatDate(quarantineEndNoIsolation)}`,
                explanation: `${ISOLATION_TIME} Tage nach Ende der Isolation von IP (${formatDate(quarantineEndNoIsolation)})`
            }
        }
    }
}
