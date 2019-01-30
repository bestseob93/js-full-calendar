import moment from 'moment'
import { qs, $on, $delegate } from 'helpers'

export default class View {
  constructor (template) {
    this.inputDatas = {
      id: 0,
      title: '',
      bgColor: '',
      startDate: '',
      endDate: '',
      period: 0,
      memo: ''
    }

    this.template = template
    this.$calendar = qs('.calendar__body')

    /* Header left */
    this.$today = qs('.header__date-today')
    this.$prevBtn = qs('.nav__button--prev')
    this.$nextBtn = qs('.nav__button--next')
    this.$todayBtn = qs('.nav__button--today')

    /* Header center(tabs) */
    this.$monthBtn = qs('[data-mode="Month"]')
    this.$weekBtn = qs('[data-mode="Week"]')
    this.$dayBtn = qs('[data-mode="Day"]')

    this.$addTodo = qs('.header__todo-button--add')

    /* Modal */
    this.$modalContainer = qs('.modal__container')
    this.$modal = qs('.modal')
    this.$modalHeader = qs('.modal .modal__header h3')
    this.$closeBtn = qs('.modal .close')

    this.$title = qs('input[name="title"]')
    this.$startDate = qs('input[name="startDate"]')
    this.$endDate = qs('input[name="endDate"]')
    this.$memo = qs('textarea[name="memo"]')

    this.$submit = qs('.submit__btn')
    this.$editBtn = qs('.edit__btn')
    this.$deleteBtn = qs('.delete__btn')

    /* Observer */
    $delegate(this.$calendar, '.calendar__event', 'click', ({ target }) => {
      this.showEventDetail(target)
    })

    /* Bind input change events */
    $on(this.$title, 'change', this.handleChange.bind(this))
    $on(this.$startDate, 'change', this.handleChange.bind(this))
    $on(this.$endDate, 'change', this.handleChange.bind(this))
    $on(this.$memo, 'change', this.handleChange.bind(this))

    this.init()
  }

  /**
   * Initialize
   */
  init () {
    this.$calendar.innerHTML = this.template.show('month')
    this.renderTodayDate()
  }

  /**
   * Open modal that contains event detail when element Clicked
   *
   * @param {HTMLElement} target onClicked Elemenet
   */
  showEventDetail (target) {
    const data = JSON.parse(target.dataset.event)
    /**
     * Set inputDatas from target's dataset attributes
     */
    this.inputDatas = data
    this.openModal()
    this.setModalToEditMode()

    /**
     * Set data values to each input value
     */
    this.$title.value = data.title
    this.$startDate.value = data.startDate
    this.$endDate.value = data.endDate
    this.$memo.value = data.memo
  }

  /**
   * Open modal that contains more events list when element Clicked
   * @param {HTMLElement} target
   */
  showMoreEventList (target) {
    console.log(target)
  }

  /**
   * Change modal's appearance Footer to Add
   */
  setModalToAddMode () {
    this.$modalHeader.innerHTML = '일정 추가'
    this.$submit.style.display = 'block'
    this.$deleteBtn.style.display = 'none'
    this.$editBtn.style.display = 'none'
  }

  /**
   * Change modal's appearance to Edit/Delete
   */
  setModalToEditMode () {
    this.$modalHeader.innerHTML = '일정'
    this.$submit.style.display = 'none'
    this.$deleteBtn.style.display = 'block'
    this.$editBtn.style.display = 'block'
  }

  /**
   * Change modal's appearance to More
   */
  setModalToMoreMode () {
    console.log('More Styling')
  }

  /**
   * Display Today Date
   * example: 2019.01.30
   */
  renderTodayDate () {
    this.$today.innerHTML = moment().format('YYYY.MM.DD')
  }

  /**********
   * Bind EventListener
   **********/
  bindPrevBtnClick (handler) {
    $on(this.$prevBtn, 'click', handler)
  }

  bindNextBtnClick (handler) {
    $on(this.$nextBtn, 'click', handler)
  }

  bindTodayBtnClick (handler) {
    $on(this.$todayBtn, 'click', handler)
  }

  bindMonthBtnClick (handler) {
    $on(this.$monthBtn, 'click', handler)
  }

  bindWeekBtnClick (handler) {
    $on(this.$weekBtn, 'click', handler)
  }

  bindDayBtnClick (handler) {
    $on(this.$dayBtn, 'click', handler)
  }

  bindAddTodoBtnClick (handler) {
    $on(this.$addTodo, 'click', handler)
  }

  bindCloseModalBtnClick (handler) {
    $on(this.$closeBtn, 'click', handler)
  }

  bindMoreBtnClick (handler) {
    $delegate(this.$calendar, '.more', 'click', handler)
  }

  /**
   * Clear input values
   */
  clearInputs () {
    this.$title.value = ''
    this.$startDate.value = ''
    this.$endDate.value = ''
    this.$memo.value = ''
  }

  /**
   * Change inputDatas when on change input
   *
   * @param {SyntheticEvent} e
   */
  handleChange (e) {
    this.inputDatas = {
      ...this.inputDatas,
      [e.target.name]: e.target.value.trim()
    }
  }

  /**
   * @param {Function} handler Function called on synthetic event.
   */
  bindOnSubmit (handler) {
    $on(this.$submit, 'click', (e) => {
      const datas = { ...this.inputDatas }
      handler(e, datas)
    })
  }

  /**
   * @param {Function} handler Function called on synthetic event
   */
  bindOnEditClick (handler) {
    $on(this.$editBtn, 'click', (e) => {
      const datas = { ...this.inputDatas }

      handler(e, datas)
    })
  }

  /**
   * @param {Function} handler Function called on synthetic event
   */
  bindOnDeleteClick (handler) {
    $on(this.$deleteBtn, 'click', (e) => {
      const datas = { ...this.inputDatas }
      handler(e, datas.id)
    })
  }

  /**
   * Render Month when mode is month
   *
   * @param {Array} datas Array of datas to display
   */
  renderMonth (datas) {
    console.log(datas)
    this.$calendar.innerHTML = this.template.show('month', datas)
  }

  /**
   * Render Week when mode is week
   *
   * @param {Array} datas Array of datas to display
   */
  renderWeek (datas) {
    this.$calendar.innerHTML = this.template.show('week', datas)
  }

  /**
   * Render Day when mode is day
   *
   * @param {Array} datas Array of datas to display
   */
  renderDay (datas) {
    this.$calendar.innerHTML = this.template.show('day', datas)
  }

  /**
   * Open the Modal
   */
  openModal () {
    this.$modalContainer.style.display = 'block'
    this.setModalToAddMode()
    this.$modal.classList.add('opend')
  }

  /**
   * Close the Modal
   */
  closeModal () {
    this.$modalContainer.style.display = 'none'
    this.$modal.classList.remove('opend')
    this.clearInputs()
  }
}
