app.filter('number', function() {
    return function(input, isHex) {
        if (isHex) {
            var hex = input.toString(16).toUpperCase();
            return hex.length == 1 ? "0" + hex: hex;
        } else {
            return input.toString(10);
        }
    };
});