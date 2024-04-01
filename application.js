(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", (event) => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector("#status");
    let port;

    function addLine(linesId, text) {
      var senderLine = document.createElement("div");
      senderLine.className = "line";
      var textnode = document.createTextNode(text);
      senderLine.appendChild(textnode);
      document.getElementById(linesId).appendChild(senderLine);
      return senderLine;
    }

    let currentReceiverLine;

    function appendLines(linesId, text) {
      const lines = text.split("\0");
      if (currentReceiverLine) {
        currentReceiverLine.innerHTML =
          currentReceiverLine.innerHTML + lines[0];
        for (let i = 1; i < lines.length; i++) {
          currentReceiverLine = addLine(linesId, lines[i]);
        }
      } else {
        for (let i = 0; i < lines.length; i++) {
          currentReceiverLine = addLine(linesId, lines[i]);
        }
      }
    }

    function connect() {
      let receivedData = "";
      port.connect().then(
        () => {
          statusDisplay.textContent = "";
          connectButton.textContent = "Disconnect";

          port.onReceive = (data) => {
            let textDecoder = new TextDecoder();
            receivedData += textDecoder.decode(data);

            if (data.getInt8() === 13) {
              currentReceiverLine = null;
            } else {
              
                appendLines("receiver_lines", textDecoder.decode(data));
              if (receivedData.includes("}")) {
                // Найдем подстроку между фигурных скобок
                const startIndex = receivedData.indexOf("{");
                const endIndex = receivedData.indexOf("}");
                const jsonSubstring = receivedData.slice(
                  startIndex,
                  endIndex + 1
                );

                // Распарсим JSON-объект
                try {
                  const parsedObject = JSON.parse(jsonSubstring);
                  variables._ACCEL_A = parsedObject.ACCEL_A;
                  variables._ACCEL_B = parsedObject.ACCEL_B;
                  variables._BEEPER = parsedObject.BEEPER;
                  variables._CALIBR = parsedObject.CALIBR;
                  variables._CALIBR_DATA = parsedObject.CALIBR_DATA;
                  variables._LED = parsedObject.LED;
                  variables._LIMIT_360 = parsedObject.LIMIT_360;
                  variables._SEGMENT_1 = parsedObject.SEGMENT_1;
                  variables._SEGMENT_2 = parsedObject.SEGMENT_2;
                  variables._SEGMENT_3 = parsedObject.SEGMENT_3;
                  variables._SPEED_MAX = parsedObject.SPEED_MAX;
                  variables._STEPER_PARAM = parsedObject.STEPER_PARAM;
                  variables._STEPS = parsedObject.STEPS;
                  variables._ZERO_SENSOR = parsedObject.ZERO_SENSOR;

                  console.log(parsedObject);
                  console.log(variables);
                  document.getElementById("_STEPS").value = variables._STEPS;

                  document.getElementById("_SPEED_MAX").value =
                    variables._SPEED_MAX;
                  document.getElementById("_ACCEL_A").value =
                    variables._ACCEL_A;
                  document.getElementById("_ACCEL_B").value =
                    variables._ACCEL_B;
                  document.getElementById("_SEGMENT_1").value =
                    variables._SEGMENT_1;
                  document.getElementById("_SEGMENT_2").value =
                    variables._SEGMENT_2;
                  document.getElementById("_SEGMENT_3").value =
                    variables._SEGMENT_3;
                  document.getElementById("_STEPER_PARAM").value =
                    variables._STEPER_PARAM;
                  document.getElementById("CALIBR_DATA_A").value =
                    variables._CALIBR_DATA[0];
                  document.getElementById("CALIBR_DATA_B").value =
                    variables._CALIBR_DATA[1];
                  document.getElementById("CALIBR_DATA_C").value =
                    variables._CALIBR_DATA[2];
                  document.getElementById("CALIBR_DATA_D").value =
                    variables._CALIBR_DATA[3];
                  document.getElementById("CALIBR_DATA_E").value =
                    variables._CALIBR_DATA[4];
                  document.getElementById("CALIBR_DATA_F").value =
                    variables._CALIBR_DATA[5];
                  document.getElementById("_BEEPER").value = variables._BEEPER;
                  document.getElementById("_LED").value = variables._LED;
                  document.getElementById("_LIMIT_360").value =
                    variables._LIMIT_360;
                  document.getElementById("_ZERO_SENSOR").value =
                    variables._ZERO_SENSOR;
                } catch (error) {
                  console.error(
                    "Ошибка при распарсивании JSON-объекта:",
                    error.message
                  );
                }
                console.log(receivedData);
                // console.log(JSON.parse(receivedData));
                receivedData = "";
              }
            }
          };
          port.onReceiveError = (error) => {
            console.error(error);
          };
        },
        (error) => {
          statusDisplay.textContent = error;
        }
      );
    }

    connectButton.addEventListener("click", function () {
      if (port) {
        port.disconnect();
        connectButton.textContent = "Connect";
        statusDisplay.textContent = "";
        port = null;
      } else {
        serial
          .requestPort()
          .then((selectedPort) => {
            port = selectedPort;
            connect();
          })
          .catch((error) => {
            statusDisplay.textContent = error;
          });
      }
    });

    serial.getPorts().then((ports) => {
      if (ports.length === 0) {
        statusDisplay.textContent = "No device found.";
      } else {
        statusDisplay.textContent = "Connecting...";
        port = ports[0];
        connect();
      }
    });

    let commandLine = document.getElementById("command_line");

    commandLine.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        if (commandLine.value.length > 0) {
          addLine("sender_lines", commandLine.value);
          commandLine.value = "";
        }
      }

      port.send(
        new TextEncoder("utf-8").encode(
          String.fromCharCode(event.which || event.keyCode)
        )
      );
    });

    // Получаем кнопку по id
    const myButton = document.getElementById("Reed");
    const myWrite = document.getElementById("Write");
    const myCalibrate = document.getElementById("Calibrate ");

    // Добавляем обработчик события click
    myButton.addEventListener("click", function () {
      // Ваш код обработки клика здесь
      console.log("Клик по кнопке!");

      port.send(new TextEncoder("utf-8").encode("Reed" + "\0"));
    });
    // Добавляем обработчик события click
    myWrite.addEventListener("click", function () {
      // Ваш код обработки клика здесь
      console.log("Клик по кнопке!");
      variables._STEPS = parseFloat(document.getElementById("_STEPS").value);
     

      variables._SPEED_MAX = parseFloat(
        document.getElementById("_SPEED_MAX").value
      );
      variables._ACCEL_A = parseFloat(
        document.getElementById("_ACCEL_A").value
      );
      variables._ACCEL_B = parseFloat(
        document.getElementById("_ACCEL_B").value
      );
      variables._SEGMENT_1 = parseFloat(
        document.getElementById("_SEGMENT_1").value
      );
      variables._SEGMENT_2 = parseFloat(
        document.getElementById("_SEGMENT_2").value
      );
      variables._SEGMENT_3 = parseFloat(
        document.getElementById("_SEGMENT_3").value
      );
      variables._STEPER_PARAM = parseFloat(
        document.getElementById("_STEPER_PARAM").value
      );
      variables._CALIBR_DATA[0] = parseFloat(
        document.getElementById("CALIBR_DATA_A").value
      );
      variables._CALIBR_DATA[1] = parseFloat(
        document.getElementById("CALIBR_DATA_B").value
      );
      variables._CALIBR_DATA[2] = parseFloat(
        document.getElementById("CALIBR_DATA_C").value
      );
      variables._CALIBR_DATA[3] = parseFloat(
        document.getElementById("CALIBR_DATA_D").value
      );
      variables._CALIBR_DATA[4] = parseFloat(
        document.getElementById("CALIBR_DATA_E").value
      );
      variables._CALIBR_DATA[5] = parseFloat(
        document.getElementById("CALIBR_DATA_F").value
      );
      
      variables._BEEPER = Boolean(document.getElementById("_BEEPER").value === "true");
      variables._LED = Boolean(document.getElementById("_LED").value === "true");
      
      variables._LIMIT_360 = Boolean(
        document.getElementById("_LIMIT_360").value === "true"
      );
      variables._ZERO_SENSOR = Boolean(
        document.getElementById("_ZERO_SENSOR").value === "true"
      );

      console.log(variables);

      port.send(new TextEncoder("utf-8").encode("Write" + "\0"));
      port.send(
        new TextEncoder("utf-8").encode(JSON.stringify(variables) + "\0")
      );
    });
    // Добавляем обработчик события click
    myCalibrate.addEventListener("click", function () {
      // Ваш код обработки клика здесь
      console.log("Клик по кнопке!");
      console.log(JSON.stringify(variables));

      port.send(new TextEncoder("utf-8").encode("Calibrate" + "\0"));
    });
  });
})();
