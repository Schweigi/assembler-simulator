app.directive('tabSupport', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            element.bind("keydown", function (e) {
                if (e.keyCode === 9) {
                    var val = this.value;
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    this.value = val.substring(0, start) + '\t' + val.substring(end);
                    this.selectionStart = this.selectionEnd = start + 1;

                    e.preventDefault();
                    return false;
                }
            });
        }
    };
}]);