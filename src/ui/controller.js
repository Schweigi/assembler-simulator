app.controller('Ctrl', ['$document', '$scope', '$timeout', 'cpu', 'memory', 'assembler', function($document, $scope, $timeout, cpu, memory, assembler) {
    $scope.memory = memory;
    $scope.cpu = cpu;
    $scope.error = '';
    $scope.isRunning = false;
    $scope.displayHex = true;
    $scope.displayInstr = true;
    $scope.displayA = false;
    $scope.displayB = false;
    $scope.displayC = false;
    $scope.displayD = false;
    $scope.speeds = [{speed:1, desc:"1 HZ"}, {speed:4, desc:"4 HZ"}, {speed:8, desc:"8 HZ"}, {speed:16, desc:"16 HZ"}];
    $scope.speed = 4;
    $scope.outputStartIndex = 232;

    $scope.code = "; Simple example\n; Writes Hello World to the output\n\n	JMP start\nhello: DB \"Hello World!\" ; Variable\n       DB 0	; String terminator\n\nstart:\n	MOV C, hello    ; Point to var \n	MOV D, 232	; Point to output\n	CALL print\n        HLT             ; Stop execution\n\nprint:			; print(C:*from, D:*to)\n	PUSH A\n	PUSH B\n	MOV B, 0\n.loop:\n	MOV A, [C]	; Get char from var\n	MOV [D], A	; Write to output\n	INC C\n	INC D  \n	CMP B, [C]	; Check if end\n	JNZ .loop	; jump if not\n\n	POP B\n	POP A\n	RET";

    $scope.reset = function() {
        cpu.reset();
        memory.reset();
        $scope.error = '';
        $scope.selectedLine = -1;
    };

    $scope.executeStep = function() {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        try {
            // Execute
            var res = cpu.step();

            // Mark in code
            if (cpu.ip in $scope.mapping) {
                $scope.selectedLine = $scope.mapping[cpu.ip];
            }

            return res;
        } catch (e) {
            $scope.error = e;
            return false;
        }
    };

    var runner;
    $scope.run = function() {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        $scope.isRunning = true;
        runner = $timeout(function() {
            if ($scope.executeStep() === true) {
                $scope.run();
            } else {
                $scope.isRunning = false;
            }
        }, 1000 / $scope.speed);
    };

    $scope.stop = function() {
        $timeout.cancel(runner);
        $scope.isRunning = false;
    };

    $scope.checkPrgrmLoaded = function() {
        for (var i = 0, l = memory.data.length; i < l; i++) {
            if (memory.data[i] !== 0) {
                return true;
            }
        }

        return false;
    };

    $scope.getChar = function(value) {
        var text = String.fromCharCode(value);

        if (text.trim() === '') {
            return '\u00A0\u00A0';
        } else {
            return text;
        }
    };

    $scope.assemble = function() {
        try {
            $scope.reset();

            var assembly = assembler.go($scope.code);
            $scope.mapping = assembly.mapping;
            var binary = assembly.code;
			$scope.labels = assembly.labels;

            if (binary.length > memory.data.length)
                throw "Binary code does not fit into the memory. Max " + memory.data.length + " bytes are allowed";

            for (var i = 0, l = binary.length; i < l; i++) {
                memory.data[i] = binary[i];
            }
        } catch (e) {
            if (e.line !== undefined) {
                $scope.error = e.line + " | " + e.error;
                $scope.selectedLine = e.line;
            } else {
                $scope.error = e.error;
            }
        }
    };

    $scope.jumpToLine = function(index) {
        $document[0].getElementById('sourceCode').scrollIntoView();
        $scope.selectedLine = $scope.mapping[index];
    };


    $scope.isInstruction = function(index) {
        return $scope.mapping !== undefined &&
               $scope.mapping[index] !== undefined &&
               $scope.displayInstr;
    };

    $scope.getMemoryCellCss = function(index) {
        if (index >= $scope.outputStartIndex) {
            return 'output-bg';
        } else if ($scope.isInstruction(index)) {
            return 'instr-bg';
        } else if (index > cpu.sp && index <= cpu.maxSP) {
            return 'stack-bg';
        } else {
            return '';
        }
    };

    $scope.getMemoryInnerCellCss = function(index) {
        if (index === cpu.ip) {
            return 'marker marker-ip';
        } else if (index === cpu.sp) {
            return 'marker marker-sp';
        } else if (index === cpu.gpr[0] && $scope.displayA) {
            return 'marker marker-a';
        } else if (index === cpu.gpr[1] && $scope.displayB) {
            return 'marker marker-b';
        } else if (index === cpu.gpr[2] && $scope.displayC) {
            return 'marker marker-c';
        } else if (index === cpu.gpr[3] && $scope.displayD) {
            return 'marker marker-d';
        } else {
            return '';
        }
    };
}]);