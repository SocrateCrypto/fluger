document.getElementById('Reed').addEventListener('click', async () => {
  try {
    // Запрашиваем доступ к USB-устройству
    const device = await navigator.usb.requestDevice({
      filters: [] // фильтры для поиска устройства
    });

    // Открываем устройство
    await device.open();

    // Запрашиваем конфигурацию устройства
    await device.selectConfiguration(1);

    // Запрашиваем доступ к интерфейсу 0
    await device.claimInterface(0);

    // Определяем массив байтов для передачи
    const data = new Uint8Array([82, 69, 69, 68]); // ASCII коды для "R", "E", "E", "D"

    // Отправляем данные на устройство
    await device.transferOut(1, data);

    console.log('Data sent: REED');
  } catch (error) {
    console.error('Error:', error);
  }
});
