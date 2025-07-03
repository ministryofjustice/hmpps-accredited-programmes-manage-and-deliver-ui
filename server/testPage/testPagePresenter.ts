import { DummyData } from '../services/accreditedProgrammesManageAndDeliverService'

export default class TestPagePresenter {
  constructor(private testData: DummyData) {
    this.testData = testData
  }
}
