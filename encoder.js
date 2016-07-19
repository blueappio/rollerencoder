(function() {
    var count = 0;
    class Encoder {
        constructor() {
            this.rotations = '';
            this.name = '';
            this.time = '';

            this.peripherals = {};
            var gattip = navigator.bluetooth.gattip;

            gattip.once('ready', function(gateway) {
                function onScan(peripheral) {
                    var mfrData;
                    if (peripheral.advdata) {
                        mfrData = peripheral.advdata.manufacturerData["02F4"] || peripheral.advdata.manufacturerData["02f4"];
                    } else {
                        mfrData = peripheral.getMfrData('02F4') || peripheral.getMfrData('02f4');
                    }
                    if (mfrData) {
                        if (!rollerencoder.peripherals[peripheral.uuid]) {
                            peripheral.counterGraphData = [{
                                values: [],
                                key: 'Rotations'
                            }];
                        }

                        rollerencoder.peripherals[peripheral.uuid] = peripheral;
                        var data = mfrData.substr(0, 4);
                        var rotations = parseInt(data[2] + data[3] + data[0] + data[1], 16);

                        var d = new Date();
                        var currDate = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

                        if (!isNaN(Number(rotations))) {
                            rollerencoder.peripherals[peripheral.uuid].counterData = {
                                timeNum: count,
                                date: currDate,
                                temp: Number(rotations)
                            }
                        }
                        count++;

                        rollerencoder.time = currDate;
                        rollerencoder.peripherals[peripheral.uuid].rotations = rotations
                        rollerencoder.updateUI();
                    }
                }
                gateway.scan();
                gateway.on('scan', onScan);
            });

            gattip.on('error', function(err) {
                console.log(err);
            });
        }
    }

    window.rollerencoder = new Encoder();
})();