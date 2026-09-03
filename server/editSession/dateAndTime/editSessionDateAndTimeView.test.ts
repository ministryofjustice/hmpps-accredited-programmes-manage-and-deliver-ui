import EditSessionDateAndTimeView from './editSessionDateAndTimeView'

describe('time input fields', () => {
  it('limits hour and minute values to two digits in edit session inputs', () => {
    const presenter = {
      backLinkUri: '/back',
      pageTitle: 'Edit the session date and time',
      text: {},
      isGroupSession: false,
      fields: {
        sessionDate: { errorMessage: null, value: '01/01/2026' },
        startTime: {
          errorMessages: [],
          hour: { hasError: false, value: '9' },
          minute: { hasError: false, value: '30' },
          partOfDay: { hasError: false, value: 'AM' },
        },
        endTime: {
          errorMessages: [],
          hour: { hasError: false, value: '10' },
          minute: { hasError: false, value: '45' },
          partOfDay: { hasError: false, value: 'PM' },
        },
      },
    } as unknown as ConstructorParameters<typeof EditSessionDateAndTimeView>[0]

    const view = new EditSessionDateAndTimeView(presenter)

    expect(view.startTimeInputArgs.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'hour', attributes: { maxlength: '2' } }),
        expect.objectContaining({ name: 'minute', attributes: { maxlength: '2' } }),
      ]),
    )

    expect(view.endTimeInputArgs.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'hour', attributes: { maxlength: '2' } }),
        expect.objectContaining({ name: 'minute', attributes: { maxlength: '2' } }),
      ]),
    )
  })
})
