; Simple example No 3
; Printing out data at console in loop 

JMP start

;ASCII

char_1:	DB 66
char_2:	DB 73 
char_3:	DB 83
; 	DB 0
string:	DB " BIS"
DB 0
;print out
	
start:	
	MOV D, 0xE8
	MOV B, char_1
next:	MOV C, [B]
	MOV [D], C

	INC D
	INC B
	MOV A, [B]
	CMP A, 0
	JNZ next 

HLT
