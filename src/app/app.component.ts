import { Component } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { House, IsolationInfo, Person, QuarantineInfo } from './classes/Person';

interface IsolationRow {
  name: string,
  isolationStart: string,
  isolationEnd: string,
  permitStart: string,
  permitEnd: string
}

interface QuarantineRow {
  name: string,
  quarantineStart: string,
  quarantineEnd: string,
  permitStart: string,
  permitEnd: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _name: string = '';
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
    this.populateTable()
  }
  symptomDate: Date | undefined = new Date()
  testDate: Date | undefined = new Date()
  resultDate: Date | undefined = new Date()
  isolationDate: Date | undefined = new Date()

  success: boolean = false

  radioModel: 'canIsolate' | 'cannotIsolate' = 'canIsolate'
  canIsolate: boolean = true

  isolationInfo: IsolationInfo | undefined
  quarantineInfo: QuarantineInfo | undefined

  isolationRows: IsolationRow[] = [];
  isolationColumns = [{ prop: 'name', name: 'Person' }, { prop: 'isolationStart', name: 'Isolation Start' }, { prop: 'isolationEnd', name: 'Isolation Ende' }, { prop: 'permitStart', name: 'Verfügung Start' }, { prop: 'permitEnd', name: 'Verfügung Ende' }];

  quarantineRows: QuarantineRow[] = [];
  quarantineColumns = [{ prop: 'name', name: 'Person' }, { prop: 'quarantineStart', name: 'Quarantäne Start' }, { prop: 'quarantineEnd', name: 'Quarantäne Ende' }, { prop: 'permitStart', name: 'Verfügung Start' }, { prop: 'permitEnd', name: 'Verfügung Ende' }];

  constructor(private localeService: BsLocaleService) {
    this.applyLocale()
  }

  reset() {
    this.success = false
    this.isolationInfo = undefined
    this.quarantineInfo = undefined
  }

  onValueChange(event: any) {
    console.log('value changed')

    if (!this.symptomDate) {
      // throw new Error('symptomDate not set')
      this.reset()
      return
    }
    if (!this.testDate) {
      // throw new Error('testDate not set')
      this.reset()
      return
    }
    if (!this.resultDate) {
      // throw new Error('resultDate not set')
      this.reset()
      return
    }
    if (!this.isolationDate) {
      // throw new Error('isolationDate not set')
      this.reset()
      return
    }

    const person = new Person(this.name, this.symptomDate, this.testDate, this.resultDate, this.isolationDate)

    this.isolationInfo = person.getInfos()



    this.quarantineInfo = House.getRoommateInfo(person)

    this.populateTable()

    this.success = true
  }

  canIsolateClicked() {
    this.canIsolate = !this.canIsolate
    this.populateTable()

  }

  populateTable() {
    if (!this.isolationInfo) {
      return
    }

    this.isolationRows = [{
      name: this.name,
      isolationStart: this.isolationInfo.isolation.start,
      isolationEnd: this.isolationInfo.isolation.end,
      permitStart: this.isolationInfo.verfuegung.start,
      permitEnd: this.isolationInfo.verfuegung.end
    }
    ]

    if (!this.quarantineInfo) {
      return
    }

    this.quarantineRows = []

    if (this.canIsolate) {
      this.quarantineRows.push({
        name: 'Normal (Isoliert)',
        quarantineStart: this.quarantineInfo.normal.start,
        quarantineEnd: this.quarantineInfo.normal.end,
        permitStart: this.quarantineInfo.normal.start,
        permitEnd: this.quarantineInfo.normal.end
      })
    } else {
      this.quarantineRows.push({
        name: 'Unter 12 (nicht isoliert)',
        quarantineStart: this.quarantineInfo.under12.start,
        quarantineEnd: this.quarantineInfo.under12.end,
        permitStart: this.quarantineInfo.under12.start,
        permitEnd: this.quarantineInfo.under12.end
      }, {
        name: 'Über 12 (nicht isoliert)',
        quarantineStart: this.quarantineInfo.over12.start,
        quarantineEnd: this.quarantineInfo.over12.end,
        permitStart: this.quarantineInfo.over12.start,
        permitEnd: this.quarantineInfo.over12.end
      })

    }
  }

  applyLocale() {
    this.localeService.use('de');
  }
}
