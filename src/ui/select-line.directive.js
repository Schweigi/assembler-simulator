// Source: http://lostsource.com/2012/11/30/selecting-textarea-line.html
app.directive('selectLine', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            scope.$watch('selectedLine', function() {
                if (scope.selectedLine >= 0) {
                    var lines = element[0].value.split("\n");

                    // Calculate start/end
                    var startPos = 0;
                    for(var x = 0; x < lines.length; x++) {
                        if(x == scope.selectedLine) {
                            break;
                        }
                        startPos += (lines[x].length+1);
                    }

                    var endPos = lines[scope.selectedLine].length+startPos;

                    // Chrome / Firefox
                    if(typeof(element[0].selectionStart) != "undefined") {
                        element[0].focus();
                        element[0].selectionStart = startPos;
                        element[0].selectionEnd = endPos;
                    }

                    // IE
                    if (document.selection && document.selection.createRange) {
                        element[0].focus();
                        element[0].select();
                        var range = document.selection.createRange();
                        range.collapse(true);
                        range.moveEnd("character", endPos);
                        range.moveStart("character", startPos);
                        range.select();
                    }
                }
            });
        }
    };
}]);