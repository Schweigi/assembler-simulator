app.service('input', ['memory', function (memory) {
    var input = {
        data: Array(16),
        reset: function(){
            this.data.fill(false);
        },
        setBit : function(bit){
            if (bit >= this.data.length) {
                throw "Input access error: " + bit;
            }

            if(this.data[bit]){
                this.data[bit] = false;
            } else {
                this.data[bit] = true;
            }
            
            var byte = 0;
            for (var i = 0; i < 8; ++i) {
                if(this.data[i]){
                    byte += Math.pow(2, i);
                }
            }
            memory.store(255, byte);

            byte = 0;
            for (; i < 16; ++i) {
                if(this.data[i]){
                    byte += Math.pow(2, i - 8);
                }
            }
            memory.store(254, byte);
        }
    };

    input.reset();
    return input;
}]);