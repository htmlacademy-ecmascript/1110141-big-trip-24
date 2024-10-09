
/**
 * Возвращает строку-HTML разметку из тегов option для элемента datalist формы события
 * @param {Array} destinationPoints Список точек назначение (городов)
 * @returns {string} Возвращает HTML разметку из списка городов (тег option)
 */
const getDatalistOption = (destinationPoints) => {
  const destinationListOptions = [];
  destinationPoints.forEach((point) => {
    destinationListOptions.push(`<option value="${ point.name }"></option>`);
  });
  return destinationListOptions.join('');
};


const getEventTypeData = (offers, type) => {
  const eventTypeData = (offers.map((point) => ({
    eventType: point.type,
    isChecked: type === point.type ? 'checked' : ''
  })));

  return eventTypeData;
};

export { getDatalistOption, getEventTypeData };
