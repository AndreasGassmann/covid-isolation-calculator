import { Component } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { House, IsolationInfo, Person, QuarantineInfo } from './classes/Person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  symptomDate: Date | undefined = new Date()
  testDate: Date | undefined = new Date()
  resultDate: Date | undefined = new Date()
  isolationDate: Date | undefined = new Date()

  success: boolean = false

  radioModel: 'canIsolate' | 'cannotIsolate' = 'canIsolate'
  canIsolate: boolean = true

  isolationInfo: IsolationInfo | undefined
  quarantineInfo: QuarantineInfo | undefined

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

    const person = new Person('', this.symptomDate, this.testDate, this.resultDate, this.isolationDate)

    this.isolationInfo = person.getInfos()
    this.quarantineInfo = House.getRoommateInfo(person)

    this.success = true
  }

  canIsolateClicked() {
    this.canIsolate = !this.canIsolate
  }

  applyLocale() {
    this.localeService.use('de');
  }
}
